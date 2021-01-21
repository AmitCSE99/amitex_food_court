const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const feedBackSchema=new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    message:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Feedback', feedBackSchema);