const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const path=require('path')
let _ =require('lodash')
const signupRouter=require("./signuprouter");
const chatRouter=require("./chatrouter");

app.use(cors());
mongoose.connect("mongodb://localhost:27017/database",{useNewUrlParser: true})
// mongoose.connect("mongodb://@ds249233.mlab.com:49233/drupal-database",{
//     useNewUrlParser: true,
//     auth: {
//       user: 'akashsahu495',
//       password: 'fbhacker1'
//     }
//   })
.then(()=>{
    console.log("Mongodb connected")
})
.catch((err)=>{
    console.log("error oocured while connecting the mongo")
})
let socket=require('socket.io')
//server starting
let server=app.listen(process.env.PORT || 8085,()=>{
    console.log("starting server at port 8085");
});

app.use('/',signupRouter)
app.use('/chat',chatRouter)

app.use(express.static('upload'));
app.use(express.static(__dirname + '/public'))



//socket setup
let users=[]
let io=socket(server)
io.on('connection',(socket)=>{
    console.log("Connected Socked Id: ",socket.id)

    //to store the online users
	socket.on('setUser',(data)=>{
		console.log("inside set user",data)
        users.push(data)
        users=_.uniqBy(users,'room')
		io.sockets.emit('setUser',users)
		console.log("new users",users)
    })
    
    socket.on('disconnect',()=>{
		console.log("user disconnected",socket.id)
		// _.remove(users, {socketId: socket.id})
        io.sockets.emit('setUser',users)
    })
    //send messages
    socket.on('chat',(data)=>{
        console.log("msg received",data)
        io.sockets.emit('chat',data)
    })
    //typing mesages
    socket.on('typing',(data)=>{
		// console.log("data of typing")
		io.sockets.emit('typing',data)	//to return the typing data to front end
	})
})
