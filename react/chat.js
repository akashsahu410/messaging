import React from "react";
import { Link, withRouter } from "react-router-dom";
import jwt from 'jsonwebtoken'
import $ from 'jquery'
import config from "./config.js"

import io from 'socket.io-client'
let socket=io(config.googleAuth.backend,{transports: ['websocket', 'polling', 'flashsocket']});

const axios = require("axios");
class Chat extends React.Component {
    state={
         
        room:'',
        sender_id:'',
        user_name:'',
        user_flag:'',
        messages:[]
    }

    componentDidMount(){
        jwt.verify(localStorage.getItem("user_id"), 'pokemon', (err, decoded)=>{
            if(err){
                localStorage.clear()
            }else{
                this.setState({sender_id:decoded.user_id});                             
            }
        }) 
          

        jwt.verify(localStorage.getItem("user_name"), 'pokemon', (err, decoded)=>{
            if(err){
                localStorage.clear()
            }else{
                this.setState({user_name:decoded.user_name});                             
            }
        })

        let sessionFlag = jwt.verify(localStorage.getItem("user_flag"), 'pokemon', (err, decoded)=>{
            if(err){
                localStorage.clear()
            }else{
                return decoded                            
            }
        }) 

        const queryParams = new URLSearchParams(window.location.search);
        const ticketno = queryParams.get('ticketno'); 
        this.setState({room:ticketno});

        //GetAllMessages
        this.getAllMessages(ticketno,sessionFlag.user_flag);

        socket.emit("join",{
            room:ticketno
        })



        socket.off('setUser').on('setUser', (data) =>{
            //socket.on('setUser', (data) =>{
            console.log("socket.on"); 

            if(data.room==ticketno){
                console.log("msg received",data)
                var date=new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(Date.now())
                var html = '<div class="chat outgoing"><div class="details"><p>'+data.name+': '+data.msg+' '+date+'</p></div></div>';
                $(".chat-box").append(html);
                $(".chat-box").animate({ scrollTop: 20000000 }, 4000);
            }
            
        
        })


        socket.off('setImage').on('setImage', (data) =>{
            //socket.on('setImage', (data) =>{
            console.log("socket.on"); 

            if(data.room==ticketno){
                console.log("msg received",data)
                

                
                var date=new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(Date.now())
                var html = `<div class="chat outgoing" id=div${data.id}><div class="details"><p><img  src=${config.googleAuth.backend}chat/${data.msg} height='100px' width='100px'/><a href='#!' id=${data.id}>Delete</a><br />${data.name}, ${date}</p></div></div>`;
                $(".chat-box").append(html);
                document.getElementById(data.id).addEventListener('click',this.deleteChat,false)
                $(".chat-box").animate({ scrollTop: 20000000 }, 4000);
            }
        
        })

	}


    priyanka = (e) => {
        console.log("Priyanka");
        //socket.on('setUser',(data)=>{   
            socket.off('setUser').on('setUser', (data) =>{
            console.log("socket.on");

              

            console.log("msg received",data)
            var date=new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(Date.now())
            var html = '<div class="chat outgoing"><div class="details"><p>'+data.name+': '+data.msg+'  '+date+'</p></div></div>';
            $(".chat-box").append(html);

            
           

        })
    }

    sendButton = (e) =>{    
        var msg = $("#message").val();         
        if(msg!=''){   
            
            

            let options={
                method:"POST",
                headers:{
                Accept:"application/json",
                  "Content-Type":"application/json"
                },
                body:JSON.stringify({msg:msg, room:this.state.room, sender_name:this.state.user_name, sender_id:this.state.sender_id,date:Date.now()})
              }
              
              fetch(config.googleAuth.backURL+`user/saveChatRequest`,options)
              .then(res=>{
          
                return res.json();
              })

              .then(data=>{
                  if(data.status == true){
                    socket.emit("setUser",{
                        msg:msg,
                        name:this.state.user_name,
                        room:this.state.room
                    })
                      console.log("Successfully Save Message!!");
                      
                  }else{
                      console.log("Ops! Message not save in database!!");
                  }
              })

              .catch(err=>{
                console.log("error",err)
              }) 


            
            this.priyanka();
        }
        $("#message").val('');
    }

     
    getAllMessages=(ticketno,flag)=>{
        let options={
            method:"POST",
            headers:{
            Accept:"application/json",
              "Content-Type":"application/json"
            },
            body:JSON.stringify({ticketno:ticketno,flag:flag})
          }
          
          fetch(config.googleAuth.backURL+`user/getAllMessages`,options)
          .then(res=>{
            return res.json();
          })

          .then(data=>{
                if(data.status == true){
                    this.setState({messages:data.data});
                  console.log(this.state.messages);  
                  
                  $(".chat-box").animate({ scrollTop: 20000000 }, 4000);
                }else{
                  console.log("Ops! Message not save in database!!");
                }
          })

          .catch(err=>{
            console.log("error",err)
          })  

    }
    

      

    onFileChange = (e) => {
        

        let newObj = new FormData();
        newObj.append('file', e.target.files[0]);
        newObj.append('room', this.state.room);
        newObj.append('sender_name', this.state.user_name);
        newObj.append('sender_id', this.state.sender_id);
        newObj.append('date', Date.now());

        axios.post(config.googleAuth.backURL+`user/addAttchmentChat`,newObj)
        .then(res=>{
            console.log("response",res.data)
            if(res.data.status == true){
                      

                socket.emit("setImage", {
                    msg:res.data.photo,
                    id:res.data.id,
                    name:this.state.user_name,
                    room:this.state.room
                })
                $("#file").val('');
               

            }else{
                alert("Ops! Something went wrong please try again later.");
            }
            
        })
        .catch(err=>{
            console.log("error",err)
        })
    }

    deleteChat = (e) => {
        

        let id = e.target.id
        
        let options={
            method:"POST",
            headers:{
            Accept:"application/json",
              "Content-Type":"application/json"
            },
            body:JSON.stringify({id:id})
          }
          
          fetch(config.googleAuth.backURL+`user/deleteChatRequest`,options)
          .then(res=>{
            return res.json();
          })

            .then(data=>{
                if(data.status == true){
                    console.log("Dsadasdsadad");
                    $("#div"+id).remove();
                    
                  $(".chat-box").animate({ scrollTop: 20000000 }, 4000);
                }else{
                  console.log("Ops! Message not save in database!!");
                }
            })

          .catch(err=>{
            console.log("error",err)
          })  

    }
    render() {
        return ( 
           
        
    <div class="appHdr">
        <header>
        <div class="main-header">
            <div class="chatHeader">
                <Link to="my-ticket" class="back-icon">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                </Link>
                <Link to="profile">
                    <img src="images/user1.png" />
                </Link>
                <div class="details">
                    <span>{this.state.user_name}</span>
                    <p></p>
                </div>

            </div>
        </div>
        </header>


        <section class="appBody chatAreaBodyOuter">
            <div class="chat-drop-dwn">
            <div class="src-cat-grp">
                 
                <div class="src-bars">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
            </div>    
             </div>   
            <div class="commonBody chatAreaBody">
                    <div class="chat-box">
                    <form id='chatbox'>
                    {this.state.messages.map((msg,index)=>{ 
                        return(
                        msg.sender_id.toString() === this.state.sender_id.toString()? (  <>
                            <div class="chat outgoing right" >
                                <div class="details" id={`div${msg.id}`}>
                                {msg.message? (  <>
                                    <p>Me:  {msg.message	} {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format( msg.date)}</p>
                                </>) : ( 
                                
                                <>
                                    <p><img src={`${config.googleAuth.backend}chat/${msg.attachment}`} height='100px' width='100px'/>
                                    <a href='#!' id={`${msg.id}`} onClick={this.deleteChat}>Delete</a><br />
                                    {msg.name}, {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format( msg.date)}</p>
                                </>
                                    
                                )}
                                </div>
                            </div> 
                        </>
                        ) : (
                        <>
                        <div class="chat outgoing left">
                            <div class="details" id={`div${msg.id}`}>
                                

                                {msg.message? (  <>
                                    <p>{msg.name}: { msg.message	} {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format( msg.date)}</p>
                                </>) : ( 
                                
                                <>
                                   <p> <img id="imgid" src={`${config.googleAuth.backend}chat/${msg.attachment}`} height='100px' width='100px'/>
                                    <a href='#!' id={`${msg.id}`} onClick={this.deleteChat}>Delete</a><br />
                                    {msg.name}, {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format( msg.date)}</p>
                                </>
                                    
                                )}
                            </div>
                        </div>
                        </>
                        )
                    )    
                    })}
                
                        </form>
                        
                 </div>
            </div>

            <div class="chatFtr">
                <div class="typing-area">
                    <Link class="pic-add" to="/">
                         <i class="fa fa-camera" aria-hidden="true"></i>
                    </Link>
                    <input type="file" name='file' id='file' class="form-control" accept="image/*" onChange={this.onFileChange}/> 

                    <div class="form-group">
                        <input class="form-control chat-text" onKeyPress={this.sendTyping} type="text" id='message' placeholder="Type message here...." />
                        <i class="fa fa-paper-plane chat-msg" aria-hidden="true" onClick={this.sendButton} ></i>
                         
                        {/* <label id="typing"></label> */}

                    </div>

                </div>
            </div>
            
        </section>
    </div>
       
  );
}
}
export default Chat;