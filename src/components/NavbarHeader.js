import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

import { Github, GridFill } from 'react-bootstrap-icons';


export const NavbarHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [styles, setStyles] = useState({});

  useEffect(() => {
    const onScroll = () => {
        if (window.scrollY > 50) { 
            setScrolled(true);

            let scrollPercent = window.scrollY/(document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100;
            scrollPercent = scrollPercent >= 100 ? 100 : scrollPercent;

            console.log()

            setStyles({ 'width' : scrollPercent+'%', 'borderBottom' : '1px solid #fefefe', 'position' : 'absolute', 'bottom' : 0, 'left' : 0 });
        } else {
            setScrolled(false);

            setStyles({})
        }

    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <div style={styles}></div>
        <Container>
            <Navbar.Brand href="#">William Echols</Navbar.Brand>
            <Navbar.Brand href="https://github.com/WilliamEchols"><Github size={30} /></Navbar.Brand>
            <Navbar.Toggle style={{ "display" : scrolled ? "" : "none" }} data-toggle="collapse" ><GridFill size={35} fill={"#fefefe"} /></Navbar.Toggle>
            <Navbar.Collapse>
                <Nav className="ms-auto">
                    <Nav.Link href="#t-minus" className="navbar-link">T-Minus</Nav.Link>
                    <Nav.Link href="#ln2" className="navbar-link">ln(2)</Nav.Link>
                    <Nav.Link href="#contact" className="navbar-link">Reach Out</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}