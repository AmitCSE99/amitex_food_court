const User=require('../models/user');
const bcrypt=require('bcryptjs');
const {validationResult}=require('express-validator/check');
exports.getSignUp=(req,res,next)=>{
    let message=req.flash('error');
  if(message.length>0){
    message=message[0];
  }
  else{
    message=null;
  }
    res.render('auth/signup',{
        errorMessage:message,
        oldInput:{
            name:'',
            email:'',
            password:'',
            confirmPassword:'',
            contactNumber:'',
            address:''
        }
    });
}
exports.postSignUp=(req,res,next)=>{
    let loc=[];
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const contactNumber=req.body.contactNumber;
    const address=req.body.address;
    loc.push(address);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422).render('auth/signup', {
        errorMessage:errors.array()[0].msg,
        oldInput:{name:name,email:email,password:password,contactNumber:contactNumber,address:address}
      })
    }
    return bcrypt.hash(password,12).then(hashedPassword=>{
        const user=new User({
            name:name,
            email: email,
            password: hashedPassword,
            isAdmin:false,
            contactNumber:contactNumber,
            address:loc,
            cart:{items:[]}
        }
        );
        return user.save().then(result=>{
            return res.redirect('/login');
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    })
}
exports.getLogin=(req,res,next)=>{
    let message=req.flash('error');
  if(message.length>0){
    message=message[0];
  }
  else{
    message=null;
  }
    res.render('auth/login',{
        errorMessage:message
    });
}
exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage:errors.array()[0].msg
    })
  }
    User.findOne({email:email}).then(user=>{
        if(!user){
            req.flash('error','email not yet resgisterd')
            return res.redirect('/login');
        }
        bcrypt.compare(password,user.password).then(doMatch=>{
            if(doMatch){
                if(user.isAdmin){
                    user.cart={items:[]};
                    user.save();
                    console.log("Admin logged in");
                    req.session.isLoggedIn=true;
                    req.session.isAdmin=true;
                    req.session.user=user;
                    return req.session.save(err=>{
                        console.log(err);
                        return res.redirect('/');
                    })
                }
                req.session.isLoggedIn=true;
                req.session.user=user;
                return req.session.save(err=>{
                    console.log(err);
                    return res.redirect('/');
                })
            }
            req.flash('error','Invalid Password')
            return res.redirect('/login');
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    })
}

exports.getEditProfile=(req,res,next)=>{
    User.findById(req.user._id).then(user=>{
        console.log(user);
        res.render('auth/edit-profile',{
            user:user
        });
    }).catch(err=>{
        console.log(error);
    })
}

exports.postEditProfile=(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const contactNumber=req.body.contactNumber;
    User.findById(req.user._id).then(user=>{
        user.name=name;
        user.email=email;
        user.contactNumber=contactNumber;
        return user.save().then(result=>{
            res.redirect('/profile');
        });
    }).catch(err=>{
        console.log(err);
    })
}

exports.getAddress=(req,res,next)=>{
    res.render('auth/address',{
        user:req.user
    })
}

exports.getProfile=(req,res,next)=>{
    res.render('auth/profile',{
        user:req.user
    });
}

exports.getEditAddress=(req,res,next)=>{
    const index=req.params.addressIndex;
    console.log(index);
    res.render('auth/edit-address',{
        user:req.user,
        index:index
    });
}
exports.postEditAddress=(req,res,next)=>{
    const index=req.body.index;
    const address=req.body.address;
    console.log(index);
    console.log(address);
    const addresses=[...req.user.address];
    addresses[index]=address;
    User.findById(req.user._id).then(user=>{
        user.address=addresses;
        return user.save().then(result=>{
            res.redirect('/address');
        })
    }).catch(err=>{
        console.log(err);
    })
}
exports.getNewAddress=(req,res,next)=>{
    res.render('auth/new-address');
}
exports.postNewAddress=(req,res,next)=>{
    const newAddress=req.body.address;
    const avaliableAddresses=[...req.user.address];
    avaliableAddresses.push(newAddress);
    User.findById(req.user._id).then(user=>{
        user.address=avaliableAddresses;
        return user.save().then(result=>{
            res.redirect('/address');
        })
    }).catch(err=>{
        console.log(err);
    })

}


exports.postLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
}