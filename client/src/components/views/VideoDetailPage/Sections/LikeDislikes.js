import React, { useEffect, useState } from 'react'
import {Alert, Tooltip} from 'antd'
import {LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled} from '@ant-design/icons'
import axios from 'axios'


function LikeDislikes(props) {
    const [likes, setLikes]=useState(0)
    const [dislikes, setDislikes]=useState(0)
    const [likeAction, setLikeAction]=useState(null)
    const [dislikeAction, setDislikeAction]=useState(null)

    let variable={}
    if(props.video){
        variable={videoId: props.videoId, userId:props.userId}
    }else{
        variable={commentId: props.commentId, userId:props.userId}
    }

    useEffect(()=>{
        axios.post('/api/like/getLikes',variable)
            .then(response=>{
                if(response.data.success){
                    //얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length)

                    //내가 이미 그 좋아요를 눌렀는지
                    response.data.likes.map(like=>{
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })
                }else{
                    Alert('Like에 대한 정보를 가져오지 못했습니다.')
                }
            })

        axios.post('/api/like/getDislikes',variable)
            .then(response=>{
                if(response.data.success){
                    //얼마나 많은 싫어요를 받았는지
                    setDislikes(response.data.dislikes.length)

                    //내가 이미 그 싫어요를 눌렀는지
                    response.data.dislikes.map(dislike=>{
                        if(dislike.userId === props.userId){
                            setDislikeAction('disliked')
                        }
                    })
                }else{
                    Alert('DisLike에 대한 정보를 가져오지 못했습니다.')
                }
            })
    },[])

    const onLike=()=>{
        if(likeAction===null){
            axios.post('/api/like/upLike', variable)
                .then(response=>{
                    if(response.data.success){
                        setLikes(likes+1)
                        setLikeAction('liked')

                        if(dislikeAction !==null){
                            setDislikeAction(null)
                            setDislikes(dislikes-1)
                        }
                    }else{
                        alert('Like를 가져오지 못했습니다.')
                    }
                })
        }else{
            axios.post('/api/like/unLike', variable)
                .then(response=>{
                    if(response.data.success){
                        setLikes(likes-1)
                        setLikeAction(null)
                    }else{
                        alert('Like를 내리지 못했습니다.')
                    }
                })
        }
    }

    const onDisLike=()=>{
        if(dislikeAction===null){
            axios.post('/api/like/upDislike', variable)
                .then(response=>{
                    if(response.data.success){
                        setDislikes(dislikes+1)
                        setDislikeAction('disliked')

                        if(likeAction !==null){
                            setLikeAction(null)
                            setLikes(likes-1)
                        }
                    }else{
                        alert('Like를 가져오지 못했습니다.')
                    }
                })
        }else{
            axios.post('/api/like/unDislike', variable)
                .then(response=>{
                    if(response.data.success){
                        setDislikes(dislikes-1)
                        setDislikeAction(null)
                    }else{
                        alert('dislike을 지우지 못했습니다.')
                    }
                })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {likeAction==='liked'? <LikeFilled onClick={onLike}/>:<LikeOutlined onClick={onLike}/>}
                </Tooltip>
            <span style={{paddingLeft:'8px', cursor:'auto'}}>{likes} </span>
            </span>
            
            <span key="comment-basic-like">
                <Tooltip title="Dislike">
                    {dislikeAction==='disliked'? <DislikeFilled onClick={onDisLike}/>:<DislikeOutlined onClick={onDisLike}/>}
                </Tooltip>
            <span style={{paddingLeft:'8px', cursor:'auto'}}>{dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDislikes