import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {Form, Input, Button, Typography} from 'antd';
import { useDispatch } from "react-redux";
import { registerUser } from '../../../_actions/user_action'
import { UserOutlined  } from '@ant-design/icons';

const { Title } = Typography;

function RegisterPage() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [Email, setEmail] = useState("")
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onConfirmEmailHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
}
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    if(Password !== ConfirmPassword) {
      return alert("비밀번호가 동일하지 않습니다.");
  }

  let body = {
      email: Email,
      name: Name,
      password: Password
  }

  // redux dispatch를 이용해 action을 취함
  dispatch(registerUser(body))
    .then(response => {
        if(response.payload.success){
            //props.history.push('/login');
            history('/');
        }else{
            alert('Error')
            console.log(response)
        }
    })
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center',
      width: '100%', height: 'calc(100vh - 150px)'
    }}>
      <Title level={2}>Sign up</Title>
      <Form
        name="normal_login"
        style={{width:'350px'}}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 32 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}       
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your Name"
            type="text"
            value={Name}
            onChange={onNameHandler}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }]}       
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
          label="Password"
          rules={[{ required: true, message: 'Please input your Password!' }]}       
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your password"
            type="Password"
            value={Password}
            onChange={onPasswordHandler}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm"
          rules={[{ required: true, message: 'Please input your Password!' }]}       
        >
          <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter your password"
              type="Password"
              value={Password}
              onChange={onConfirmEmailHandler}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ minWidth: '100%' }}>
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default RegisterPage