import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

import { NavbarHeader } from "./components/NavbarHeader";
import { Animation } from './components/Animation'

import { Container, Row, Col } from "react-bootstrap";
import { CodeSlash, Cursor, Book } from 'react-bootstrap-icons';
import 'animate.css';


function App() {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });


  const animationSrc1 = './spaceship.glb';
  const animationPos1 = [40, 20, 0];

  const animationSrc2 = './earth.glb';
  const animationPos2 = [0, 10, 35];

  const [showFirstAnimation, setShowFirstAnimation] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setShowFirstAnimation(window.scrollY < 2 * document.documentElement.clientHeight)
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, )



  return (
    <div className='App'>
      <NavbarHeader />


        <div className='banner-bg vw-100 vh-100' />

        { /* Banner */ }
        <section className="banner" id="home">
          <Container style={{ 'minHeight': '65vh' }}>

            <Animation modelSrc={animationSrc1} camera={showFirstAnimation ? [80, 60, 60] : []} position={'fixed'} modelPosition={isMobile ? [0, animationPos1[1], 0 ] : animationPos1} />
            <Animation modelSrc={animationSrc2} camera={showFirstAnimation ? [] : [80, 60, 60]} position={'fixed'} modelPosition={isMobile ? [0, animationPos2[1], 0 ] : animationPos2} />

            <Row>

              <Col xs={12} md={6} xl={7}>
                <div className={"animate__animated animate__fadeInUp"}>
                  <h1>Hey, my name is William</h1><br />
                  <h3 style={{ "color": "darkgrey" }}>I am interested in</h3>
                  <ul style={{ "color": "darkgrey" }}>
                      <li>Programming <CodeSlash size={25} /> - JS, C++, Python </li>
                      <li> Space <Cursor size={25} />         - Rockets, Physics, Radio </li>
                      <li>Learning <Book size={25} />         - Blender, Esoteric Programming </li>
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} xl={5}>

              </Col>
            </Row>
          </Container>
        </section>

        { /* Info */ }
        <section className="banner" style={{ 'background': '#0c164f', 'position': 'relative' }} id="t-minus">
          <Container style={{ 'minHeight': '65vh' }}>
            <Animation modelSrc={'./launch.glb'} camera={ isMobile ? [500, 0, -500] : [300, 0, -300]} position={'absolute'} modelPosition={ isMobile ? [-140, -280, 140] : [70, -40, 70]} />

            <Row className='h-100'>
              <Col xs={12} md={7} xl={7}>

              </Col>
              <Col xs={12} md={5} xl={5}>
                <div>
                    <h1>T-minus 5</h1><br />
                    <h3 style={{ "color": "lightgrey" }}>Projects and Experience</h3>
                    <ul style={{ "color": "lightgrey" }}>
                        <li>Experience - Software Development Internship (2021 - 2022) [Contact for details]</li>
                        <li>Personal Challenge - daily projects uploaded to Github - favorites:
                          <ul>
                            <li>Piet (image based esoteric language) visual editor - Python 3</li>
                            <li>Conway's Game of Life - C++</li>
                            <li>Brainf*** (minimalistic esoteric language) interpreter - C++</li>
                          </ul>
                        </li>
                        <li>Achievements - Most accurate calculation of the natural log of 2 (precise to 1.5 x 10^12 digits)</li>
                    </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        { /* ln(2) */ }
        <section className="banner" style={{ 'background': '#0c164f', 'position': 'relative' }} id="ln2">
          <Container style={{ 'minHeight': '65vh' }}>

            <Row className='h-100'>
            <Col xs={12} md={5} xl={5}>
                <div>
                    <h1>Natural Log of 2 Calculation</h1><br />
                    <h4 style={{ "color": "lightgrey" }}>I enjoy operating enterprise-level server hardware as a homelab as a tool for education and personal development. In September 2021, I was able to use this computer to successfully calculate the Natural Log of 2 to a total of 1.5 x 10^12 digits with the y-cruncher program, working as a hands-on system operator with a Linux-based operating system. This is the most precise calculation of ln(2) to date.</h4>
                </div>
              </Col>
              <Col xs={12} md={7} xl={7}>
                <img style={{ 'maxWidth': '100%' }} alt="server used in calculation" src={"./server.png"} />
                <p>Server used in calculation (48 cores, 256 GB ram, 200 TB storage - w/o RAID)</p>
              </Col>
            </Row>
          </Container>
        </section>

        { /* Contact */ }
        <section className="banner" id="contact">
          <Container style={{ 'minHeight': '65vh' }}>

            <Row>

              <Col xs={12} md={6} xl={5}>
              </Col>
              <Col xs={12} md={6} xl={7}>
                <div className={"animate__animated animate__fadeInUp"}>
                  <h1>Reach Out</h1><br />
                  <h3 style={{ "color": "darkgrey" }}>If you are interested, please reach out. Also, thank you for visiting my website.</h3>
                </div>
              </Col>

            </Row>
          </Container>
        </section>

      
    </div>
  );
}

export default App;