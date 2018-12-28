const express=require('express');
const app=express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const userapi=require('./chatapi');

//to fetch all the mesages
app.post("/find",async (req,res)=>{
    try{
        let data;
        console.log("inside chat router",req.body);
        data=await userapi.finddata(req.body.senderRoom,req.body.receiverRoom)
        console.log("data ndskfdsf",data)
        if(data.length === 0){
            data=await userapi.createdata({senderRoom:req.body.senderRoom,receiverRoom:req.body.receiverRoom,
                chat:[{sender:req.body.sender,receiver:req.body.receiver,message:"welocme",time:new Date().toLocaleTimeString(),date:new Date().toLocaleDateString()}]})
            console.log("data if empty",data)
        }
        res.status(200).send(data)
    }
    catch(err){
        console.log("error in chat router",err)
        res.status(404).send(err);

    }
})
//to save the messages
app.post("/save",async (req,res)=>{
    try{
        console.log("inside chat of save router",req.body);
        let data=await userapi.savedata(req.body.senderRoom,req.body.receiverRoom,
            req.body.chat)
        console.log("data fetched",data)
        res.status(200).send(data)
    }
    catch(err){
        console.log("error in chat save router",err)
        res.status(404).send(err);

    }
})

module.exports=app;