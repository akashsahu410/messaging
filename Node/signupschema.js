const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
});
module.exports=mongoose.model("signup_collections",userSchema);
