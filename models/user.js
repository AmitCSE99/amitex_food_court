const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    contactNumber:{
      type:Number
    },
    address:[],
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        items:[{
            productId:{
                type: Schema.Types.ObjectId,
                ref:'Product',
                required: true
            },
            quantity:{
                type: Number,
                required: true,
            },
            totalPrice:{
                type:Number
            }
        }]
    }
}
    
);
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    let newPrice=product.productPrice;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
      updatedCartItems[cartProductIndex].totalPrice=newQuantity*newPrice;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
        totalPrice:newPrice,
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };
  userSchema.methods.removeFromCart=function(productId){
    const updatedCartItem=this.cart.items.filter(item=>{
      return item.productId.toString()!==productId.toString();
    });
    this.cart.items=updatedCartItem;
    return this.save();
  }


  userSchema.methods.reduceCartQuantity=function(product){
    const cartProductIndex=this.cart.items.findIndex(cp=>{
      return cp.productId.toString()===product._id.toString();
    });
    const updatedCartItems=[...this.cart.items];
    let newQuantity;
    let oldPrice=product.productPrice;
    if(updatedCartItems[cartProductIndex].quantity==1){
      return this.removeFromCart(product._id);
    }
    newQuantity=updatedCartItems[cartProductIndex].quantity-1;
    let newPrice=newQuantity*oldPrice;
    updatedCartItems[cartProductIndex].quantity=newQuantity;
    updatedCartItems[cartProductIndex].totalPrice=newPrice;
    const updatedCart={
      items:updatedCartItems
    }
    this.cart=updatedCart;
    return this.save();
  }
  userSchema.methods.increaseCartQuantity=function(product){
    const cartProductIndex=this.cart.items.findIndex(cp=>{
      return cp.productId.toString()===product._id.toString();
    });
    const updatedCartItems=[...this.cart.items];
    let newQuantity;
    let oldPrice=product.productPrice;
    newQuantity=updatedCartItems[cartProductIndex].quantity+1;
    let newPrice=newQuantity*oldPrice;
    updatedCartItems[cartProductIndex].quantity=newQuantity;
    updatedCartItems[cartProductIndex].totalPrice=newPrice;
    const updatedCart={
      items:updatedCartItems
    }
    this.cart=updatedCart;
    return this.save();
  }
  userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };
module.exports = mongoose.model('User', userSchema);