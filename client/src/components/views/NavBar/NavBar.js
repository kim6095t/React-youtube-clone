import React from 'react';
import {Navbar,Nav, Container, NavDropdown,Form } from 'react-bootstrap'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import youtubeImage from '../../../_asset/image/youtube.png'

function NavBar() {
  const user = useSelector(state => state.userReducer)
  const history = useNavigate();


  const logoutHandler = () => {
    axios.get('/api/users/logout').then(response=>{
      if(response.status===200){
        history('/login')
      }else{
        alert('Log Out Failed')
      }
    })
  };

  return (
    <div style={{ position: 'fixed', zIndex: 5, width: '100%'}}>
      <Navbar bg="light" expand="lg" >
        <Container fluid>
          <Navbar.Brand href="/">
            <img alt="youtube_Image" style={{ width:'100px' }} src={youtubeImage} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/subscription">Subscribe</Nav.Link>
              <Nav.Link href="/video/upload">Upload</Nav.Link>
            </Nav>
            {user.userData && !user.userData.isAuth?
                <Form className="d-flex">
                  <Nav.Link href="/login">SignIn</Nav.Link>
                  <Nav.Link href="/register">Signup</Nav.Link>
                </Form>
              :
              <Form className="d-flex">
                  <Nav.Link onClick={logoutHandler}>LogOut</Nav.Link>
              </Form>          
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar