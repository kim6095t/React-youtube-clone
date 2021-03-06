import React, {useState} from 'react'
import { Typography, Button, Form, message, Input } from 'antd'
import Dropzone from 'react-dropzone'
import axios from 'axios';
import { PlusOutlined  } from '@ant-design/icons';
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

const {TextArea}=Input
const {Title}=Typography

const PrivateOptions=[
    {value:0, label:"Private"},
    {value:1, label:"Public"}
]
const CategoryOptions=[
    {value:0, label:"Film & Animation"},
    {value:1, label:"Autos & Vehicles"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"}
]

const VideoUploadPage=()=>{
    const history = useNavigate();
    const user=useSelector(state=>state.userReducer)

    const [VideoTitle, setVideoTitle]=useState("")
    const [Description, setDescription]=useState("")
    const [Private, setPrivate]=useState(0)
    const [Category, setCategory]=useState("Film & Animation")
    const [FilePath, setFilePath]=useState("")
    const [Duration, setDuration]=useState("")
    const [ThumbnailPath, setThumbnailPath]=useState("")


    const onPrivateChange=(e)=>{
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange=(e)=>{
        setCategory(e.currentTarget.value)
    }    

    const onTitleChange=(e)=>{
        setVideoTitle(e.currentTarget.value)
    }
    const onDescriptionChange=(e)=>{
        setDescription(e.currentTarget.value)
    }

    const onDrop=(files)=>{
        let formData=new FormData
        const config={
            header:{'content-type':'multipart/form-data'}
        }
        formData.append("file", files[0])

        axios.post(`/api/video/uploadfiles`, formData, config).then(response=>{
            if(response.data.success){
                let variable={
                    url: response.data.filePath,
                    fileName: response.data.fileName,
                }
                setFilePath(response.data.filePath)

                axios.post(`/api/video/thumbnail`, variable).then((response)=>{
                    if(response.data.success){
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    }else{
                        alert('????????? ????????? ?????? ????????????')
                    }
                })
            }else{
                alert('????????? ???????????? ??????????????????.')
            }
        })
    }

    const onSubmit=(e)=>{
        e.preventDefault();
        const variables={
            writer: user.userData._id,
            title:VideoTitle,
            description:Description,
            private:Private,
            filePath:FilePath,
            category:Category,
            duration:Duration,
            thumbnail:ThumbnailPath,
        }
        axios.post('/api/video/uploadVideo', variables)
            .then(response=>{
                if(response.data.success){
                    message.success('??????????????? ???????????? ????????????.')
                    setTimeout(()=>{
                        history('/')
                    },3000)
                }else{
                    alert('????????? ???????????? ?????? ????????????.')
                }
            })
    }

    return(
        <div style={{maxWidth:'500px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{ display:'flex',alignItems: 'center',justifyContent:'center'}}>
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000000000000000}>
                        {({ getRootProps, getInputProps}) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray',
                            alignItems: 'center', justifyContent: 'center', display: 'flex'}} {...getRootProps()}>
                                <input {...getInputProps()} />
                                {ThumbnailPath? 
                                    <div><img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" /></div>
                                    :
                                    <PlusOutlined  style={{fontSize:'3rem'}} />
                                }
                            </div>)}
                    </Dropzone>
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea 
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size='large' onClick={onSubmit}>
                    submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage