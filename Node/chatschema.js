const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    senderRoom:{type:String},
    receiverRoom:{type:String},
    chat : { type : Array , default : [{sender:{type:String},receiver:{type:String},
        message:{type:String},time:{type:String},date:{type:String}}] },
},{ versionKey: false });
module.exports=mongoose.model("chat_collections",userSchema);
