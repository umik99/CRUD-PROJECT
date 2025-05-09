
import {React, useEffect} from 'react';

import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Navbar, NavDropdown, Nav, Container, Button} from 'react-bootstrap';
import '../../styles/base.css';

function BaseLayout({ children, user }) {


    useEffect(() =>{
        console.log("BaseLayout user :" , user);
    },[user]);

    const handleGoBack = () => {
        window.history.back();
    };
    
  
    
    return (
        <div >
         <Navbar bg="primary" data-bs-theme="dark" user={user}>
        <Container >
            
                <Navbar.Brand href="/">프로젝트명</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav >
                    <Nav.Link href="/board">Board</Nav.Link>

                    {user ?(

                    <NavDropdown title={user.username} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/">Mypage</NavDropdown.Item>
                    <NavDropdown.Item href="/">
                        Bookmarks
                    </NavDropdown.Item>

                    <NavDropdown.Item href="/logout" 
                      style={{ color: "red"}}
>
                        Log Out
                    </NavDropdown.Item>
                    </NavDropdown>
                          ) : (
                            <Button as ={Link} to ="/login" variant="primary"> Log In</Button>
                          )

                        }
                 
                 <Button type="button" className="absolute" onClick={handleGoBack}>
                        Back
                </Button>

                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        

        <div>
            {children}
        </div>
        </div>
        
       
    );
}

export default BaseLayout;