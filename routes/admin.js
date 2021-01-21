const express = require('express');

const adminController=require('../controller/admin');

const router=express.Router();

router.get('/add-product',adminController.getAddProduct);
router.post('/add-product',adminController.postAddProduct);
router.get('/admin-product-list',adminController.getAdminProducts);
router.get('/admin/:productId',adminController.getEditProducts);
router.post('/admin/:productId',adminController.postEditProducts)

module.exports=router;