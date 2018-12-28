import React from 'react'
import {Link} from 'react-router-dom'
class Signup extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name:"",
            email:"",
            password:"",
            emailValid:"",
            exist:false
        }
    }
    handleChange=(e)=>{
        this.setState({[e.target.name]:e.target.value.toLowerCase()})
    }
    email_valid=()=> {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.email) === true){
            return true;
        }
        else{
            return false;
        }
      }
    onSendData=(e)=>{
        e.preventDefault();
        console.log("state",this.state)
        if(this.email_valid())
        {     
          this.setState({emailValid:"",exist:false})
          let options={
              method:"POST",
              headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
              },
              body:JSON.stringify(this.state)
          }
          console.log("options",options)
          fetch("http://localhost:8085/signup",options)
          .then(res=>{
            console.log("response",res);
            return res.text();
          })
          .then(data=>{
            console.log("data",data)
            if(data === "Registered Successfully"){
              this.props.history.push("/login");
            }
            else
            {
              this.setState({emailValid:data,exist:true})
            }
          })
          .catch(err=>{
            console.log("error in fetch call",err)
          })
        }
        else{
          this.setState({emailValid:"Invalid Email"});
        }
    
    }
    render(){
        return(
            <div>
            <nav className="navbar navbar-expand-lg fixed-top" style={{backgroundColor:"#e11c26"}}>
                <h1 style={{color:"white",paddingLeft:"2rem"}}>Chat-App</h1>
            </nav><br/><br/><br/><br/>
            <center><h1>Signup using email</h1></center>
            <div class="container" style={{paddingLeft:"10%",paddingRight:"10%"}}>
            <form>
            <div class="form-group">
    <label for="exampleInputEmail1">Name</label>
    <input type="text" class="form-control" placeholder="Enter name" name="name" value={this.state.name} onChange={this.handleChange}/>
    
  </div>
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control"  name="email" value={this.state.email} onChange={this.handleChange} aria-describedby="emailHelp" placeholder="Enter email"/>
    
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
  </div>
  <p>{this.state.email.length === 0 || this.email_valid() === false || this.state.exist === true ? this.state.emailValid : ""}</p>
  <button type="submit" class="btn btn-primary" onClick={this.onSendData}>Signup</button>
  
  <br/><br/>
  <div className="section-title text-center center">
    <p>I already have an account.<br />
        <Link to="/login">Login My Account !</Link>
    </p>
  </div>
</form>       
            </div>
          </div>
        )
    }
}
export default Signup