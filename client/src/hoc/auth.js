import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
    //option : null = anyone, true = login user only, false = logout user only
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        const history = useNavigate();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log("auth? ", response)

                if(!response.payload.isAuth) {
                    // login yet
                    if(option) {
                        history('/login');
                    }
                }else {
                    // login 
                    if(adminRoute && !response.payload.isAdmin) {
                        history('/');
                    }else {
                        if(option === false) {
                            history('/');
                        }
                    }
                }
            })
        }, [])
        return (
            <SpecificComponent /> // component return이 없으면 React 실행이 안됨.
        )
    }
    return AuthenticationCheck;
}