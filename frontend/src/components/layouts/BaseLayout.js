
import {React, useEffect, useState} from 'react';

import { Link ,useNavigate} from 'react-router-dom'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import KULOG from '../../img/KULOG.png';
import KULOGsc from '../../img/KULOGsc.png';
import { FaArrowLeft , FaRegCommentDots} from "react-icons/fa";


import {Navbar, NavDropdown, Nav, Container, Button} from 'react-bootstrap';
import '../../styles/base.css';

function BaseLayout({ children, user }) {

  const navigate = useNavigate();

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
          <Nav className='me-auto'>
            <NavDropdown title="Category">
              <NavDropdown.Item href="/board/osaka">오사카</NavDropdown.Item>
              <NavDropdown.Item href="/board/tokyo">도쿄</NavDropdown.Item>
              <NavDropdown.Item href="/board/fukuoka">후쿠오카</NavDropdown.Item>
              <NavDropdown.Item href="/board/hokkaido">홋카이도</NavDropdown.Item>
              <NavDropdown.Item href="/board/etc">기타</NavDropdown.Item>
            </NavDropdown>
            {user ? (
              <NavDropdown title={user.nickname} id="basic-nav-dropdown" className='mypage'>
                <NavDropdown.Item href="/mypage">Mypage</NavDropdown.Item>
                <NavDropdown.Item href="/bookmark">Bookmarks</NavDropdown.Item>
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
            </Nav>
            <Nav>
            <Button
          variant="outline-secondary"
          className="icon-btn"
          onClick={() => window.open("/dm", "_blank", "width=720,height=650")}
          title="채팅"
        >
          <FaRegCommentDots style={{ fontSize: '1.1rem', verticalAlign: 'middle' }} />
        </Button>

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