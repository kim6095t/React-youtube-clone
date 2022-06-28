import React, {useState} from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {
    const user=useSelector(state=>state.userReducer)
    const [commentValue, setcommentValue]=useState("")

    const handleClick=(event)=>{
        setcommentValue(event.currentTarget.value)
    }
    const onSubmit=(event)=>{
        event.preventDefault();

        const variables={
            content:commentValue,
            writer:user.userData._id,
            postId:props.postId
        }

        axios.post('/api/comment/saveComment',variables)
            .then(response=>{
                if(response.data.success){
                    props.refreshFunction(response.data.result)
                    setcommentValue("")
                }else{
                    alert('커맨트를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index)=>(
                (!comment.responseTo &&
                    <>
                    <SingleComment key={index} refreshFunction={props.refreshFunction} comment={comment} postId={props.postId}/>
                    <ReplyComment parentCommentId={comment._id} commentLists={props.commentLists} postId={props.postId} refreshFunction={props.refreshFunction}/>
                    </>
                )   
            ))}

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea 
                    style={{width:'100%', borderRadius:"5px"}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{width:'20%', height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>

        </div>
    )
}

export default Comment