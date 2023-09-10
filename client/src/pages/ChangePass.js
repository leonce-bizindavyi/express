import React,{useState} from 'react'
import axios from 'axios'

function ChangePass() {
    const [oldpassword, setOldpassword] = useState("")
    const [newpassword, setNewpassword] = useState("")
    const changePassword = ()=>{
        axios.put(`${process.env.REACT_APP_API_URL}/auth/changepass`,{oldpassword:oldpassword,newpassword:newpassword},{
            headers:{
                accessToken: localStorage.getItem("accessToken"),
            }
        })
        .then((response)=>{
            if(response.data.error) {
                alert(response.data.error)
            }else{
                console.log(response.data)
            }
        })
    }
  return (
    <>
        <div>Change Your Password</div>
        <input type='password' placeholder='Old password' 
        onChange={(e)=>setOldpassword(e.target.value)} value={oldpassword}/>
        <input type='password' placeholder='Old password'
        onChange={(e)=>setNewpassword(e.target.value)} value={newpassword} />
        <button onClick={changePassword}>Save Change</button>
    </>
  )
}

export default ChangePass