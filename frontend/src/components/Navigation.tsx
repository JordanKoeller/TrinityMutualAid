import React from 'react';

import {
  Navbar,
  Container,
  Nav,
  Image,
} from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { MediaQuery, useMediaQuery } from '../utilities/hooks';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import DonatePage from '../pages/Donate';
import NewsPage from '../pages/News';
import ReportPage from '../pages/Report';
import RequestAidPage from '../pages/RequestAid';
import ResourcesPage from '../pages/Resources';
import HomePage from '../pages/Home';



export const TmaNavbar: React.FC = () => {

  const mq = useMediaQuery();

  const link = <Nav.Link
  id="donate-button"
  style={{ borderRadius: 0, border: '0px solid #f00'}}
  href="/Donate">
  <b>Donate</b>
</Nav.Link>;

const collapser = <Navbar.Collapse>
<Nav style={{margin: 'auto'}}>
  <Nav.Link href="/About">About</Nav.Link>
  <Nav.Link href="/RequestAid">Request Aid</Nav.Link>
  <Nav.Link href="/News">News</Nav.Link>
  <Nav.Link href="/Report">Annual Report</Nav.Link>
  <Nav.Link href="/Resources">Resources</Nav.Link>
  <Nav.Link href="/Contact">Contact</Nav.Link>
</Nav>
</Navbar.Collapse>;

  return <Navbar collapseOnSelect bg="navbar" expand="lg" sticky="top">
    <Container fluid="md"> 
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Brand as={() => <a href="/Home">
      <Image src="/tma-logo-banner.png" alt="" id="tma-logo" />
      </a>}>
    </Navbar.Brand>
    {mq <= MediaQuery.MD ? <> {link} {collapser}</> : <>{collapser} {link}</>}
  </Container>
  </Navbar>
}

export const TmaRouter: React.FC = () => {
  return <Router>
    <Switch>
    <Route path="/About">
        <AboutPage />
      </Route>
      <Route path="/RequestAid">
        <RequestAidPage />
      </Route>
      <Route path="/Donate">
        <DonatePage />
      </Route>
      <Route path="/Report">
        <ReportPage />
      </Route>
      <Route path="/News">
        <NewsPage />
      </Route>
      <Route path="/Resources">
        <ResourcesPage />
      </Route>
      <Route path="/Contact">
        <ContactPage />
      </Route>
      <Route path="">
        <HomePage />
      </Route>
    </Switch>
  </Router>
}