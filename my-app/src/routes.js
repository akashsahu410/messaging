import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import Chat from './chat'
import Signup from './signup'
import Login from './login'
import jwt from 'jsonwebtoken'

// let decode_email=jwt.decode(localStorage.getItem("email"))
// console.log(decode_email)

// console.log("verif", jwt.verify(localStorage.getItem("email"), 'pokemon', function(err, decoded) {
//     return decoded
// }).email)
// let decoded = jwt.verify(localStorage.getItem('email'), 'pokemon');
console.log("process env",process.env)
const PrivateRoute = ({ component: Component, ...rest }) => (
    (<Route {...rest} render={(props) => (
        localStorage.length>0 ? (jwt.verify(localStorage.getItem("email"), 'pokemon', (err, decoded)=>{
            if(err){
                localStorage.clear()
                console.log("props",props)
                props.history.push('/login')
            }
            else{
                return decoded                            
            }
        }).email !== null ? <Component {...props} /> : <Redirect to='/login' />) : <Redirect to='/login' />
    )} />
  ))
  //to check for login and signup 
  const Private = ({ component: Component, ...rest }) => (
    (<Route {...rest} render={(props) => (
        localStorage.length>0 ? (jwt.verify(localStorage.getItem("email"), 'pokemon', (err, decoded)=> {
            if(err)
            {
                localStorage.clear()
                props.history.push('/login')
            }
            else{
                return decoded            
            }
          }).email !== null ? <Redirect to='/chat' /> : <Component {...props} />) : <Component {...props} />
    )} />
  ))
class Routes extends React.Component{

    render(){
        return(
            <div>
                <Switch>
                    <Private exact path="/" component={Login}/>
                    <Private path="/login" component={Login}/>
                    <PrivateRoute path="/chat" component={Chat}/>
                    <Private path="/signup" component={Signup}/>
                    </Switch>
            </div>
        )
    }
}

export default Routes
