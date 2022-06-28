const express=require('express')
const router=express.Router();
const multer=require("multer")
const ffmpeg=require("fluent-ffmpeg");
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');


let storage=multer.diskStorage({
    destination:(req, file,cb)=>{
        cb(null, "uploads/") // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename:(req, file,cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})

const fileFilter = (req, file, cb) => {
    // mime type 체크하여 원하는 타입만 필터링
    if (file.mimetype == 'video/mp4' ) {
        cb(null, true);
    } else {
        cb({msg:'mp4 파일만 업로드 가능합니다.'}, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file")

router.post('/uploadfiles',(req, res)=>{
    //비디오를 서버에 저장한다.
    upload(req, res, err=>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/uploadVideo',(req, res)=>{
    //비디오 정보들을 저장한다.
    const video=new Video(req.body)
    
    video.save((err, doc)=>{
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
})

router.post('/thumbnail',(req, res)=>{
    //썸네일 생성 하고 비디오 러닝타임도 가져오기
    let filePath=""
    let fileDuration=""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err,metadata){
        fileDuration=metadata.format.duration
    })

    //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames',function(filenames){
        filePath="uploads/thumbnails/"+filenames[0]
    })
    .on('end', function(){
        return res.json({success: true, url: filePath,  fileDuration:fileDuration})
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success:false, err})
    })
    .screenshots({
        count:3,
        folder:'uploads/thumbnails/',
        size:'320x240',
        filename: "thumbnail-%b.png",
    })
})

router.get('/getVideos',(req, res)=>{
    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate('writer')
        .exec((err,videos)=>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, videos})
        })
})

router.post('/getVideoDetail',(req, res)=>{
    Video.findOne({"_id":req.body.videoId})
        .populate('writer')
        .exec((err, videoDetail)=>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, videoDetail})
        })
})

router.post('/getSubscriptionVideos',(req, res)=>{
    //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    let subscribedUser=[]
    Subscriber.find({'userFrom':req.body.userFrom})
        .exec((err, subscriberInfo)=>{
            if(err) return res.status(400).send(err)
            subscriberInfo.map((subscriber, i)=>{
                subscribedUser.push(subscriber.userTo)
            })
            //찾은 사람들의 비디오를 가지고 온다.
            Video.find({writer:{ $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos)=>{
                console.log(videos)
                if(err) return res.status(400).send(err)
                res.status(200).json({success:true, videos})
            })
        })
        
})

module.exports=router