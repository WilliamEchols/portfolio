import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from "react-router-dom";
import { NavbarHeader } from "./components/NavbarHeader";
import { Animation } from './components/Animation'

import { Container, Row, Col } from "react-bootstrap";
import { CodeSlash, Cursor, Book } from 'react-bootstrap-icons';
import 'animate.css';

import { useMediaQuery } from 'react-responsive';

function App() {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  return (
    <div className='App'>
      <NavbarHeader />

      <Routes>
        <Route path="/" element={
          <>
            <div className='banner-bg vw-100 vh-100' />

            { /* Banner */ }
            <section className="banner" id="home">
              <Container style={{ 'height': '65vh' }}>
              <Animation modelSrc={'./spaceship_test_2.glb'} camera={[80, 60, 60]} position={'fixed'} modelPosition={[isMobile ? 0 : 40, 20, 0]} />

                <Row>

                  <Col xs={12} md={6} xl={7}>
                    <div className={"animate__animated animate__fadeInUp"}>
                      <h1>Hey, my name is William</h1><br />
                      <h3 style={{ "color": "darkgrey" }}>I am interested in</h3>
                      <ul style={{ "color": "darkgrey" }}>
                          <li>Programming <CodeSlash size={25} /> - JS, C++, Python </li>
                          <li> Space <Cursor size={25} />          - Rockets, Physics, Radio </li>
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
              <Container style={{ 'height': '65vh' }}>
                <Animation modelSrc={'./realistic_spaceship.glb'} camera={[isMobile ? 600 : 300, 0, isMobile ? -600 : -300]} position={'absolute'} modelPosition={[isMobile ? -70 : 70, isMobile? 40 : -40, 70]} />

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

            { /* Contact */ }
            <section className="banner">
              <Container style={{ 'height': '65vh' }}>

                <Row>

                  <Col xs={12} md={6} xl={7}>
                    <div className={"animate__animated animate__fadeInUp"}>
                      <h1>Reach Out</h1><br />
                      <h3 style={{ "color": "darkgrey" }}>It would be really cool if the spaceship turned into a satellite orbiting a low poly Earth for this slide</h3>
                    </div>
                  </Col>
                  <Col xs={12} md={6} xl={5}>

                  </Col>
                </Row>
              </Container>
            </section>

          </>
        } />
      </Routes>
      
    </div>
  );
}

export default App;