import React,{useEffect,useState,useContext} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import axios from 'axios'
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt'
import {Authcontext} from './../helpers/Authcontext'

function Profile() {
    const {id} = useParams()
    const [username, setUsername] = useState("")
    const [postsList, setPostsList] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const navigate = useNavigate()
    const {authState} = useContext(Authcontext)

    useEffect(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/auth/basicinfo/${id}`)
      .then((response)=>{
        setUsername(response.data.username)
      })
      axios.get(`${process.env.REACT_APP_API_URL}/posts/byuserId/${id}`,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        }
      }).then((response)=>{
        if(response.data.postsList){
          setPostsList(response.data.postsList)
          setLikedPosts(response.data.likedPosts.map((like)=>{
            return like.postId
          }))
        }
        
      })
    }, [])
    
    const likePost = (postId) =>{
      axios.post(`${process.env.REACT_APP_API_URL}/like`,{postId:postId},
      {
        headers:{
          accessToken:localStorage.getItem("accessToken")
        }
      }).then((response)=>{
        setPostsList(postsList.map((post)=>{
          if(post.id === postId){
            if(response.data.liked){
              return {...post,likes: [...post.likes,0]}
            }else{
              const likesArray = post.likes
              likesArray.pop()
              return {...post,likes: likesArray}
            }
          }else{
            return post
          }
        }))
        if(likedPosts.includes(postId)){
          setLikedPosts(likedPosts.filter((id)=>{
            return id != postId
          }))
        }else{
          setLikedPosts([...likedPosts,postId])
        }
      })
    }

    const changePass = ()=>{
      navigate('/changepass')
    }

  return (
    <div className='profilePageContainer'>
        <div className='basicInfo'>
            {""}
            <h1>Username: {username} </h1>
            {username === authState.username &&(<button onClick={changePass}>Change Password</button>)}
        </div>
        <div className='listOfPosts'>
        <div className="App">
        {postsList?.map((value, key)=>{
          return (
            <div key={key} className='post'>
              <div className='title'>{value.title}</div>
              <div className='body' onClick={()=>navigate(`/post/${value.id}`)}>{value.postText}</div>
              <div className='footer'>
                <div className='username'>{value.username} </div>
              <div className='buttons'>
                <ThumbUpAlt onClick={()=>{likePost(value.id)}} className={likedPosts.includes(value.id) ? "likeBttn": "unlikeBttn" } />
                <label>{value.likes.length} </label> </div>
              </div>
            </div>
          )
        })}
      </div>
      </div>
        </div>
  )
}

export default Profile