import React, {useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd'
import axios from 'axios'
import {useSelector} from 'react-redux'
import LikeDislikes from './LikeDislikes'


function SingleComment(props) {
    const [OpenReply, setOpenReply]=useState(false)
    const [commentValue, setCommentValue]=useState()
    const user=useSelector(state=>state.userReducer)

    const onClickReplyOpen=()=>{
        setOpenReply(!OpenReply)
    }
    const onHandleChange=(event)=>{
        setCommentValue(event.currentTarget.value)
    }
    const onSubmit=(event)=>{
        event.preventDefault();

        
        const variables={
            content:commentValue,
            writer:user.userData._id,
            postId:props.postId,
            responseTo: props.comment._id
        }

        axios.post('/api/comment/saveComment',variables)
            .then(response=>{
                if(response.data.success){
                    props.refreshFunction(response.data.result)
                    setOpenReply(!OpenReply)
                    setCommentValue("")
                }else{
                    alert('커맨트를 저장하지 못했습니다.')
                }
            })
        
    }
    const actions=[
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to</span>
    ]

    
    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply&&
                <form style={{display:'flex'}} onSubmit={onSubmit}>
                    <textarea 
                        style={{width:'100%', borderRadius:"5px"}}
                        onChange={onHandleChange}
                        value={commentValue}
                        placeholder="코멘트를 작성해 주세요"
                    />
                    <br />
                    <button style={{width:'20%', height:'52px'}} onClick={onSubmit}>Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment