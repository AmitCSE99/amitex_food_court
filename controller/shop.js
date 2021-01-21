const Product=require('../models/product');
const Order=require('../models/order');
const Feedback=require('../models/feedback');
const {validationResult}=require('express-validator/check');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
      api_key:"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"
    }
  }))

exports.getIndex=(req,res,next)=>{
    res.render('home');
}
exports.getProducts=(req,res,next)=>{
    Product.find().then(products=>{
        console.log(products);
        res.render('shop/product-list',{
            prods:products
        }
        );

    }).catch(err=>{
        console.log(err);
    })
}
exports.getProduct=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findById(prodId).then(product=>{
        res.render('shop/product-detail',{
            product:product
        });

    }).catch(err=>{
        console.log(err);
    })
    
}
exports.getCart=(req,res,next)=>{
    req.user.populate('cart.items.productId').execPopulate().then(user=>{
        const products=user.cart.items;
        console.log(products);
        for(let p of products){
            if(p.productId.productPrice!=(p.totalPrice/p.quantity)){
                p.totalPrice=p.productId.productPrice*p.quantity;
            }
        }
        res.render('shop/cart',{
            products:products
        })
    }).catch(err=>{
        console.log(err);
    })
}
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        console.log(result);
        res.redirect('/cart');
      });
  };
  exports.removeFromCart=(req,res,next)=>{
      const prodId=req.body.productId;
      req.user.removeFromCart(prodId).then(result=>{
          res.redirect('/cart')
      }).catch(err=>{
          console.log(err);
      })
  }
  exports.reduceQuantity=(req,res,next)=>{
      const prodId=req.body.productId;
      Product.findById(prodId).then(product=>{
          return req.user.reduceCartQuantity(product).then(result=>{
              res.redirect('/cart');
          })
      }).catch(err=>{
          console.log(err);
      })
  }
  exports.increaseQuantity=(req,res,next)=>{
      const prodId=req.body.productId;
      Product.findById(prodId).then(product=>{
          return req.user.increaseCartQuantity(product).then(result=>{
              res.redirect('/cart');
          })
      }).catch(err=>{
          console.log(err);
      })
  }

exports.postOrder=(req,res,next)=>{
    const index=req.body.index;
    req.user.populate('cart.items.productId').execPopulate().then(user=>{
        let ts = Date.now();

        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth()+1;
        let year=date_ob.getFullYear();
        let fullDate=date+"-"+month+"-"+year;
        console.log(fullDate);
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity,totalPrice:i.totalPrice, product: { ...i.productId._doc } };
          });
          const order = new Order({
            user: {
              name: req.user.email,
              userId: req.user
            },
            products: products,
            date:fullDate,
            address:req.user.address[index]
          });
          return order.save().then(result=>{
              req.user.clearCart().then(()=>{
                  res.redirect('/orders');
              })
          });
    }).catch(err=>{
        console.log(err);
    })
}
exports.getOrders=(req,res,next)=>{
    Order.find({'user.userId':req.user._id}).then(orders=>{
        res.render('shop/orders',{
            orders:orders,
        });
    }).catch(err=>{
        console.log(err);
    })
}

exports.getSelectAddress=(req,res,next)=>{
    res.render('shop/select-address',{
        user:req.user
    })
}
exports.getFeedBack=(req,res,next)=>{
    let message=req.flash('error');
  if(message.length>0){
    message=message[0];
  }
  else{
    message=null;
  }
    res.render('shop/feedback',{
        errorMessage:message
    });

}
exports.postFeedback=(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const message=req.body.message;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      req.flash('error',errors.array()[0].msg)
    return res.status(422).render('shop/feedback', {
      errorMessage:errors.array()[0].msg
    });

  }
  const feedback=new Feedback({
      name:name,
      email:email,
      message:message,
  });
  return feedback.save().then(result=>{
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'amitendu.mallick98@gmail.com',
        subject:'Amitex Meals',
        html:`
        <p>Thanks for sending the feedback. It means a lot!</p>
        `
      })
  }).catch(err=>{
      console.log(err)
  })


}