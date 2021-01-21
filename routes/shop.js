const path = require('path');

const express = require('express');

const shopController=require('../controller/shop');
const isAuth=require('../middleware/is-auth');
const { check,body }=require('express-validator/check');

const router=express.Router();

router.get('/',shopController.getIndex);
router.get('/feedback',shopController.getFeedBack);
router.post('/feedback',[check('email').isEmail().withMessage('Please provide a valid email'),body('name','Name should not be empty').notEmpty()],shopController.postFeedback)
router.get('/products',shopController.getProducts);
router.get('/products/:productId',shopController.getProduct);
router.get('/cart',isAuth,shopController.getCart);
router.post('/cart',shopController.postCart)
router.post('/remove-from-cart',shopController.removeFromCart);
router.post('/reduce-quantity',shopController.reduceQuantity);
router.post('/increase-quantity',shopController.increaseQuantity);
router.post('/create-order',shopController.postOrder);
router.get('/orders',isAuth,shopController.getOrders);
router.get('/select-address',isAuth,shopController.getSelectAddress);
module.exports=router;