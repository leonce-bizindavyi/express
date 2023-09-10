import React,{useEffect,useState,useContext} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {Authcontext} from './../helpers/Authcontext'
import { useNavigate } from 'react-router-dom'

function Post() {
    const navigate = useNavigate()
    let {id} = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const {authState} = useContext(Authcontext)

    useEffect(() => {
      if(!localStorage.getItem("accessToken")){
        navigate('/login')
      }
      axios.get(`${process.env.REACT_APP_API_URL}/posts/byId/${id}`).then((response)=>{
        setPost(response.data)
      })
      axios.get(`${process.env.REACT_APP_API_URL}/comments/${id}`).then((response)=>{
        setComments(response.data)
      })
    }, [])
    const addComment =()=>{
      axios.post(`${process.env.REACT_APP_API_URL}/comments`,
      {commentBody:newComment,postId:id},
      {
        headers:{
          accessToken: localStorage.getItem("accessToken")
        },
      }
      ).then((response)=>{
        if(response.data.error){
          alert(response.data.error)
        }else{
          const commentToAdd = response.data
          setComments([...comments,commentToAdd])
          setNewComment("")
        }
        
      })
    }
    const deleteComment = (id)=>{
      axios.delete(`${process.env.REACT_APP_API_URL}/comments/${id}`,{
        headers:{
          accessToken: localStorage.getItem("accessToken")
        },
      })
      .then(()=>{
        setComments(comments.filter((val)=>{
          return val.id != id
        }))
    })
    }
    const deletePost = (id) =>{
      axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`,{
        headers:{
          accessToken: localStorage.getItem("accessToken")
        },
      })
      .then(()=>{
        navigate("/")
    })
    }

    const editPost = (option)=>{
      if(option === "title"){
        const newTitle = prompt("Enter new title")
        axios.put(`${process.env.REACT_APP_API_URL}/posts/title`,{newTitle:newTitle,id:id},{
          headers:{
            accessToken: localStorage.getItem("accessToken")
          }
        })
        setPost({...post,title:newTitle})
      }else{
        const newpostText = prompt("Enter new post text")
        axios.put(`${process.env.REACT_APP_API_URL}/posts/postText`,{newpostText:newpostText,id:id},{
          headers:{
            accessToken: localStorage.getItem("accessToken")
          }
        })
        setPost({...post,postText:newpostText})
      }
    }
  return (
    <div className='postPage'>
      <div className='leftSide'>
        <div className='post' id='individual'>
          <div className='title' onClick={()=>{if(authState.username === post.username){ editPost("title")}}}>{post.title} </div>
          <div className='body' onClick={()=>{if(authState.username === post.username){editPost("post")}}}>{post.postText} </div>
          <div className='footer'>{post.username} 
          {authState.username === post.username && (
            <button onClick={()=>{deletePost(post.id)}}>Delete Post</button>
          )}
           </div>
        </div>
      </div>
      <div className='rightSide'>
          <div className='addCommentContainer'>
            <input type='text' placeholder='Comment...' 
            autoComplete='off' onChange={(e)=>setNewComment(e.target.value)}
            value={newComment}/>
            <button onClick={addComment}>Add Comment</button>
          </div>
          <div className='listOfComments'>
            {comments?.map((comment,key)=>{
              return <div key={key} className='comment'>
                {comment.commentBody}
                {authState.username === comment.username && (<button onClick={()=>{deleteComment(comment.id)}}>X</button>)}
              </div>
            })}
          </div>
      </div>
    </div>
  )
}

export default Post