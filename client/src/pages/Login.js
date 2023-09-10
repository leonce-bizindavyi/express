import React,{useState, useContext} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import {Authcontext} from './../helpers/Authcontext'

function Login() {
  const {setAuthState} = useContext(Authcontext)
  const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const login = () =>{
        const data = {username:username,password:password}
        axios.post(`${process.env.REACT_APP_API_URL}/auth/login`,data).then((response)=>{
            if(response.data.error){
              alert(response.data.error)
            }else{
              localStorage.setItem("accessToken",response.data.token)
              setAuthState({
                username: response.data.username,
                id:response.data.id,
                status: true
              })
              navigate('/')
            }
          })
    }
  return (
    <div className='loginContainer'>
        <input type='text' onChange={(e)=>setUsername(e.target.value)}
        value={username} />
        <input type='password' onChange={(e)=>setPassword(e.target.value)}
        value={password} />
        <button onClick={login}>Login</button>
    </div>
  )
}

export default Login