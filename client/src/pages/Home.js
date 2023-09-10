import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt'

function Home() {
  const navigate = useNavigate()
    const [postsList, setPostsList] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    useEffect(() => {
      if(!localStorage.getItem("accessToken")){
        navigate('/login')
      }
      axios.get(`${process.env.REACT_APP_API_URL}/posts`,{
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

    return (
      <div className="App">
        {postsList?.map((value, key)=>{
          return (
            <div key={key} className='post'>
              <div className='title'>{value.title}</div>
              <div className='body' onClick={()=>navigate(`/post/${value.id}`)}>{value.postText}</div>
              <div className='footer'>
                <div className='username'><Link to={`/profile/${value.userId}`}> {value.username}</Link> </div>
              <div className='buttons'>
                <ThumbUpAlt onClick={()=>{likePost(value.id)}} className={likedPosts.includes(value.id) ? "likeBttn": "unlikeBttn" } />
                <label>{value.likes.length} </label> </div>
              </div>
            </div>
          )
        })}
      </div>
    );
}

export default Home