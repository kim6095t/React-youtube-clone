import axios from 'axios'
import React, { useEffect, useState } from 'react'


function Subscribe(props){
    const [subscribeNumber, setSubscribeNumber]=useState()
    const [subscribed, setSubscribed]=useState()

    useEffect(()=>{
        let variable={userTo: props.userTo.writer._id}
        axios.post(`/api/subscribe/subscribeNumber`, variable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber)
                }else{
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
        let subscribedVariable={userTo: props.userTo.writer._id, userFrom: localStorage.getItem('userId')}

        axios.post(`/api/subscribe/subscribed`, subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                    console.log(response.data)
                }else{
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, [])

    const onSubscribe=()=>{
        let subscribedVariable={
            userTo:props.userTo.writer._id,
            userFrom:props.userFrom,
        }
        if(subscribed){
            axios.post(`/api/subscribe/unSubscribed`, subscribedVariable)
                .then(response=>{
                    if(response.data.success){
                        setSubscribeNumber(subscribeNumber-1)
                        setSubscribed(!subscribed)
                    }else{
                        alert('구독 취소하는데 실패했습니다.')
                    }
                })
        }else{
            axios.post(`/api/subscribe/subscribe`, subscribedVariable)
                .then(response=>{
                    if(response.data.success){
                        setSubscribeNumber(subscribeNumber+1)
                        setSubscribed(!subscribed)
                    }else{
                        alert('구독 하는데 실패했습니다.')
                    }
                })
        }
    }    

    return (
        <button
            style={{
                backgroundColor:`${subscribed? '#AAAAAA':'#CC0000'}`, borderRadius:'4px',
                color:'white', padding:'10px 16px',
                fontWeight:'500', fontSize:'1rem', textTransform:'uppercase',
                width:'150px'
            }}
            onClick={onSubscribe}
        >
           {subscribeNumber} {subscribed?'Subscribed':'Subscribe'}
        </button>
    )
}

export default Subscribe