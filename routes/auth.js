const path = require('path');

const express = require('express');
const { check,body }=require('express-validator/check');

const authController=require('../controller/auth');
const isAuth=require('../middleware/is-auth')
const User=require('../models/user');

const router=express.Router();

router.get('/signup',authController.getSignUp);
router.post('/signup',[check('email').isEmail().withMessage('Please enter a valid email').custom((value,{req})=>{
return User.findOne({email:value}).then(userDoc=>{
    if(userDoc){
        return Promise.reject('Email Already Exists');
    }
})
}),body('password','Please enter a valid password').isLength({min:6})],authController.postSignUp);
router.get('/login',authController.getLogin);
router.post('/login',[check('email').isEmail().withMessage('Please enter a valid email'),body('password','Password should be at least 6 characters long').isLength({min:6})],authController.postLogin);
router.post('/logout',authController.postLogout);
router.get('/edit-profile',isAuth,authController.getEditProfile);
router.post('/edit-profile',authController.postEditProfile);
router.get('/profile',isAuth,authController.getProfile);
router.get('/address',authController.getAddress);
router.get('/edit-address/:addressIndex',isAuth,authController.getEditAddress);
router.post('/edit-address/:addressIndex',authController.postEditAddress);
router.get('/new-address',isAuth,authController.getNewAddress);
router.post('/new-address',authController.postNewAddress);
module.exports=router;