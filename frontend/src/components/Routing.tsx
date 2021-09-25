import React from 'react';

import {
  Navbar,
  Container,
  Nav,
  Image,
} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import ContactPage from './pages/Contact';
import DonatePage from './pages/Donate';
import NewsPage from './pages/News';
import ReportPage from './pages/Report';
import RequestAidPage from './pages/RequestAid';
import ResourcesPage from './pages/Resources';

export const TmaNavbar: React.FC = () => {
  return <Navbar collapseOnSelect bg="navbar" expand="lg" sticky="top">
    <Container fluid="md"> 
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Brand href="/Home">
      <Image roundedCircle src="/tma-logo.jpg" alt="" width="26" height="26" className="d-inline-block align-top" />
      {' '}
      Trinity Mutual Aid
    </Navbar.Brand>
    <Nav.Link
      as={Button}
      style={{ borderRadius: 0, border: '2px solid #f00' }}
      variant="outline-danger"
      href="/Donate"
    >
      Donate
    </Nav.Link>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/RequestAid">Request Aid</Nav.Link>
        <Nav.Link href="/Report">Report</Nav.Link>
        <Nav.Link href="/News">News</Nav.Link>
        <Nav.Link href="/Resources">Resources</Nav.Link>
        <Nav.Link href="/Contact">Contact</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
  </Navbar>
}

export const TmaRouter: React.FC = () => {
  return <Router>
    <Switch>
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
        <h1>This is the Home page </h1>
      </Route>
    </Switch>
  </Router>
}