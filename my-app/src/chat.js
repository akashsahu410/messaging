import React, { Component } from 'react';
import $ from 'jquery'
import io from 'socket.io-client'
import {uniqBy} from 'lodash'
import './App.css'
let socket=io('http://localhost:8085')   //pass server port number NOT react port number

class Chat extends Component {
	state={
		room:localStorage.getItem("litus"),
		name:localStorage.getItem("NAME"),
		email:localStorage.getItem("EMAIL"),
		time:new Date().toLocaleTimeString(),
		date:new Date().toLocaleDateString(),
		message:"",
		conversation:"",
		receiverRoom:"",
		receiver:"",
		checkUser:false
	}
	componentDidMount(){
		this.initSocket()
	}
	handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
  }
	//logout 
	logout=()=>{
		localStorage.clear()
		alert("You Successfully Logged out")
		this.props.history.push('/login')
	}
	//to send the message
	sendMessage=()=>{
		console.log("inside the send message fucntion",this.state)
		if(this.state.checkUser === true){
				$("#conversation").append(`<div class="outgoing_msg">
				<div class="sent_msg" id="receiver">
					<p>${this.state.message}</p>
					<span class="time_date"> ${this.state.time}    |    ${this.state.date}</span> 
				</div>
				</div>`)
			
			let options={
				method:"POST",
				headers:{
				Accept:"application/json",
				"Content-Type":"application/json"
				},
				body:JSON.stringify({receiverRoom:this.state.receiverRoom,senderRoom:this.state.room,chat:{sender:this.state.name,receiver:this.state.receiver,message:this.state.message,date:this.state.date,time:this.state.time}})
				}
				fetch("http://localhost:8085/chat/save",options)
				.then(res=>{
						console.log("response",res)
						return res.json();
				})
				.then(data=>{
						console.log("data fetched",data)
						$("#conversation").animate({ scrollTop: 20000000 }, 4000);
						socket.emit("chat",{
							name:this.state.name,
							message:this.state.message,
							senderRoom:this.state.room,
							receiverRoom:this.state.receiverRoom,
							date:this.state.date,
							time:this.state.time
						})
				})
				.catch(err=>{
						console.log("error in fetch all",err)
				})	
		}
		else{
			alert("First select any user")
		}
		
  }
	//to fetch the conversation
	user=(e)=>{
		console.log("inside the functin,room,name",e.target.id,e.target.innerText)
		if(e.target.id !== 'chat'){
			this.setState({receiverRoom:e.target.id,receiver:e.target.innerText,checkUser:true})
			$(`#chat`).find("*").css({"color":"#0056b3","font-size":"1.5rem"})
			$(`#${e.target.id}`).css({"color":"black","font-size":"2rem"})
			// $(`div#online`).css({"background-color":"grey"})
			
			let options={
			method:"POST",
			headers:{
			Accept:"application/json",
			"Content-Type":"application/json"
			},
			body:JSON.stringify({receiverRoom:e.target.id,senderRoom:this.state.room,sender:this.state.name,
				receiver:this.state.receiver})
			}
			fetch("http://localhost:8085/chat/find",options)
			.then(res=>{
					console.log("response",res)
					return res.json();
			})
			.then(data=>{
					console.log("data fetched",data)
						this.setState({conversation:data[0].chat})
					
			})
			.catch(err=>{
					console.log("error in fetch all",err)
			})
		}
		
	}
	//typing for chat
  sendTyping=()=>{
    console.log("inside the typing console")
    socket.emit("typing",{
      sender:this.state.name,
			receiverRoom:this.state.receiverRoom
    })
  }
	//starting the socket 
  initSocket=()=>{
    console.log("socket connected",socket,this.state)
    console.log("socket id",socket.id)
    socket.emit("setUser",{
        name:this.state.name,
				room:this.state.room,
		})

		socket.on("setUser",(data)=>{
			console.log("data caught",data)
			data=uniqBy(data)
			$("#chat").empty()
			for(let i=0;i<data.length;i++){
				if(data[i].room !== this.state.room){
					$("#chat").append(`
					<div id="online">
							<img src="https://ptetutorials.com/images/user-profile.png" height=35 width=35 />
								<a href="#" style="text-decoration:none">
								<label id=${data[i].room} style="padding:10px;font-size:1.5rem">
									${data[i].name}
									<span class=${data[i].room}></span>
								</label>
								</a>
					</div>`
					)
				document.getElementById(data[i].room).addEventListener('click',this.user,false)
				}
			}

		})

		socket.on('chat',(data)=>{
			this.setState({message:""})
			console.log("msg caught",data)
			if(data.receiverRoom === this.state.room){
				$(`.${data.senderRoom}`).text(`${data.message.substring(0,20)}...`).css({"font-size":"1rem"})
				this.setState({receiverRoom:data.senderRoom})
				$("#conversation").append(`<div class="incoming_msg">
				<div class="received_msg">
					<div class="received_withd_msg">
						<p>${data.message}</p>
						<span class="time_date"> ${data.time}   |    ${data.date}</span>
					</div>
				</div>
			</div>`)
			}
		})

		//typing caught
		socket.on('typing',(data)=>{
			console.log("tping data",data)
			if(data.receiverRoom === this.state.room){
        document.getElementById("typing").innerHTML=`<p><em>${data.sender.toUpperCase()} is typing..</em></p>`
        
			}
			//to hide typing status when user is idle
			setTimeout(()=>{
				document.getElementById("typing").innerHTML=""         
		},2000)
		})


	}
	render(){
		return(
			<div className="container">
			<button class="btn" style={{float:"right",backgroundColor:"white",color:"#e11c26"}} onClick={this.logout}>Logout</button>
			<h3 className=" text-center">Messaging</h3>
			<div className="messaging">
			  <div className="inbox_msg">
				<div className="inbox_people">
				  <div className="headind_srch">
					<div className="recent_heading">
					<center><span class="dot"></span>Online</center>
					  <h4>{this.state.name.toLocaleUpperCase()}</h4>
					</div>
					<div className="srch_bar">
					  <div className="stylish-input-group">
						<input type="text" className="search-bar" placeholder="Search" />
						<span className="input-group-addon">
						  <button type="button"> <i className="fa fa-search" aria-hidden="true" /> </button>
						</span> </div>
					</div>
				  </div>
				  <div className="inbox_chat" id="chat">
					{/* <div className="chat_list active_chat">
					  <div className="chat_people">
						<div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
						<div className="chat_ib">
						  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
						</div>
					  </div>
					</div> */}
					{/* <div className="chat_list">
					  <div className="chat_people">
						<div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
						<div className="chat_ib">
						  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
						  <p>Test, which is a new approach to have all solutions 
							astrology under one roof.</p>
						</div>
					  </div>
					</div> */}
				  </div>
				</div>
				<div className="mesgs">
					<p id="typing"></p>

				  <div className="msg_history" id="conversation">
					{
						this.state.conversation.length >1 ? 
						this.state.conversation.map(x=>{
							return x.sender === this.state.name ? 
							(<div className="outgoing_msg">
											<div className="sent_msg" id="receiver">
												<p>{x.message}</p>
												<span className="time_date"> {x.time}    |    {x.date}</span> 
											</div>
									</div>)
														
							:
							(<div className="incoming_msg">
							<div className="received_msg">
								<div className="received_withd_msg">
									<p>{x.message}</p>
									<span className="time_date"> {x.time}   |    {x.date}</span>
								</div>
							</div>
						</div>)
							}
								
					)
							: ""
					}						  
				  </div>
				  <div className="type_msg">
					<div className="input_msg_write">
					  <input type="text" className="write_msg" autoFocus  onKeyPress={this.sendTyping} value={this.state.message} placeholder="Type a message" onChange={this.handleChange} name="message"/>
					  <button onClick={this.sendMessage}>Send</button>
					</div>
				  </div>
				</div>
			  </div>
			</div></div>
		)
	}
}
export default Chat