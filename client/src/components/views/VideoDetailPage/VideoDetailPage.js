import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom";
import {Row,Col, List, Avatar} from 'antd'
import SideVideo from './Sections/SideVideo';
import Comment from "./Sections/Comment";
import LikeDislikes from './Sections/LikeDislikes';
import Subscribe from './Sections/Subscribe';

function VideoDetailPage() {
    const videoId = useParams().videoId;
    const variable={videoId:videoId}
    const [VideoDetail,setVideoDetail]=useState()
    const [Comments, setComments]=useState()

    useEffect(()=>{
        axios.post(`/api/video/getVideoDetail`, variable)
            .then(response=>{
                if(response.data.success){
                    setVideoDetail(response.data.videoDetail)
                }else{
                    alert('비디오 정보를 가져오길 실패했습니다.')
                }
            })
        axios.post('/api/comment/getComments', variable)
            .then(response=>{
                if(response.data.success){
                    setComments(response.data.comments)
                }else{
                    alert('비디오 정보를 가져오길 실패했습니다.')
                }
            })
    },[])

    const refreshFunction=(newComment)=>{
        setComments(Comments.concat(newComment))
    }

    if(VideoDetail){
        const subscribeButton=VideoDetail.writer._id!==localStorage.getItem('userId')?
            <Subscribe userTo={VideoDetail} userFrom={localStorage.getItem('userId')}/>
            :
            ''

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%', padding:'3rem 4rem'}}>
                        <video style={{height: '50vh'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton]}>
                            <List.Item.Meta
                                avatar={<Avatar src/>}
                                title={VideoDetail.title}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    }else{
        return(
            <div>loading....</div>
        )
    }    
}

export default VideoDetailPage