const path = require('path');
const User=require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf=require('csurf');
const flash=require('connect-flash');
const MONGODB_URI='mongodb+srv://AmitenduMallick:Amitendu99@cluster0.2z5od.mongodb.net/shop';
const app=express();

const store=new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
});


const shopRoutes=require('./routes/shop');
const authRoutes=require('./routes/auth');
const adminRoutes=require('./routes/admin');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
  app.use(flash());
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id).then(user=>{
        req.user=user;
        next();
    }).catch(err=>{
        console.log(err);
    })
    
});
app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.isAdmin=req.session.isAdmin;
    next();
  })
app.use(shopRoutes);
app.use(authRoutes);
app.use(adminRoutes);
mongoose.connect(MONGODB_URI).then(result=>{
    app.listen(80);
}).catch(err=>{
    console.log(err)
})
