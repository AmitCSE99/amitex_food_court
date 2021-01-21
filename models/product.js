const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const productSchema=new Schema({
    productName:{
        type: String,
        required: true
    },
    imageUrl:{
        type:String,
        required: true,
    },
    productPrice:{
        type:Number,
        required:true,
    },
    productDescription:{
        type:String,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
    
});
module.exports = mongoose.model('Product', productSchema);