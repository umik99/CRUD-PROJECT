
import {React, useEffect, useState} from 'react';

import { Link } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import KULOG from '../../img/KULOG.png';
import KULOGsc from '../../img/KULOGsc.png';
import { FaArrowLeft } from "react-icons/fa";


import {Navbar, NavDropdown, Nav, Container, Button} from 'react-bootstrap';
import '../../styles/base.css';

function BaseLayout({ children, user }) {


    useEffect(() =>{
    },[user]);

    const handleGoBack = () => {
        window.history.back();
    };
    
  
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const onScroll = () => {
        setScrolled(window.scrollY > 100); // 100px 이상 스크롤되면 true
      };
  
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, []);
    
    return (
        <div >
            <Navbar
      user={user}
      className={`navigation ${scrolled ? "scrolled" : ""}`}
      
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="/" className='kulog-logo' >
        {scrolled ? <img src={KULOG} className="logo-img"/>  : <img src={KULOGsc} className={"logo-img"}/>  }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="/">Category</Nav.Link>
            {user ? (
              <NavDropdown title={user.username} id="basic-nav-dropdown" className='mypage'>
                <NavDropdown.Item href="/">Mypage</NavDropdown.Item>
                <NavDropdown.Item href="/">Bookmarks</NavDropdown.Item>
                <NavDropdown.Item
                  href="/logout"
                  style={{ color: "red" }}
                >
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                href="/login"

              >
                Log In
              </Nav.Link>
            )}
            <Button className="back-button"  onClick={handleGoBack}>
            <FaArrowLeft />
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