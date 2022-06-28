import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from '../../../_actions/user_action'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined  } from '@ant-design/icons';

const { Title } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const history = useNavigate();

  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
}
  const onFinish = (values) => {
    console.log('Received values of form: ', values);

    let body = {
      email: Email,
      password: Password
    }
    dispatch(loginUser(body))
      .then(response => {
        console.log(response)
        //로그인 성공시 랜딩페이지로 이동
        if(response.payload.loginSuccess){
            localStorage.setItem('userId', response.payload.userId);
            localStorage.setItem('rememberMe', values.id);
            history('/')
        }else{
            alert('Error')
            console.log(response)
        }
    })
  };
  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  return (
    <div style={{
      display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: 'calc(100vh - 150px)'
    }}>
      <Title level={2}>Log In</Title>
      <Form
        name="normal_login"
        style={{width:'300px'}}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Username!' }]}       
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your email"
            type="email"
            value={Email}
            onChange={onEmailHandler}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}                  
        >
          <Input
            prefix={<LockOutlined  style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your password"
            type="password"
            value={Password}
            onChange={onPasswordHandler}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember me</Checkbox>
          <Link to="/reset_user" className="login-form-forgot" style={{ float: 'right' }}>
              forgot password
          </Link>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }}>
              Log in
          </Button>
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginPage