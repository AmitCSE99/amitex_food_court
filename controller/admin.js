const Product=require('../models/product');
exports.getAddProduct=(req,res,next)=>{

    res.render(
        'admin/add-product'
    );

}
exports.postAddProduct=(req,res,next)=>{
    const productName=req.body.productName;
    const imageUrl=req.body.imageUrl;
    const productPrice=req.body.productPrice;
    const productDescription=req.body.productDescription;
    const product=new Product({
        productName:productName,
        imageUrl:imageUrl,
        productPrice:productPrice,
        productDescription:productDescription,
        userId:req.user
    });
    product.save().then(result=>{
        return res.redirect('/');
    }).catch(err=>{
        console.log(err);
    })
}
exports.getAdminProducts=(req,res,next)=>{
    Product.find().then(prod=>{
        res.render('admin/admin-product-list',{
            prods:prod
        });
    }).catch(err=>{
        console.log(err);
    })
}
exports.getEditProducts=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findById(prodId).then(product=>{
        res.render('admin/admin-edit-product',{
            product:product
        })
    }).catch(err=>{
        console.log(err);
    })
}
exports.postEditProducts=(req,res,next)=>{
    const prodId=req.body.productId;
    const productName=req.body.productName;
    const imageUrl=req.body.imageUrl;
    const productPrice=req.body.productPrice;
    const productDescription=req.body.productDescription;
    Product.findById(prodId).then(product=>{
        product.productName=productName;
        product.imageUrl=imageUrl;
        product.productPrice=productPrice;
        product.productDescription=productDescription;
        return product.save();
    }).then(result=>{
        res.redirect('/admin-product-list')
    })
    .catch(err=>{
        console.log(err);
    })
}