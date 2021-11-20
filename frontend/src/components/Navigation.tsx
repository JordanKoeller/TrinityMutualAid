import React, { useMemo, useState } from 'react';

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
  NavLink as Link,
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
import FAQsPage from '../pages/Faqs';



export const TmaNavbar: React.FC = () => {

  const mq = useMediaQuery();

  const [open, setOpen] = useState(false);

  const link = useMemo(() => <Link
    className="donate-button"
    style={{ borderRadius: 0, border: '0px solid #f00' }}
    to="/Donate"
    activeClassName="donate-button-active">
    <b>Donate</b>
  </Link>, []);

  const collapser = useMemo(() => <Navbar.Collapse>
    <Nav style={{ margin: 'auto' }}>
      <Link className="nav-link" activeClassName="nav-link-active" to="/About" onClick={() => setOpen(false)} >About</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/RequestAid" onClick={() => setOpen(false)}>Request Aid</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/News" onClick={() => setOpen(false)}>News</Link>
      {/* <Link className="nav-link" activeClassName="nav-link-active" to="/Report" onClick={() => setOpen(false)}>Annual Report</Link> */}
      <Link className="nav-link" activeClassName="nav-link-active" to="/Resources" onClick={() => setOpen(false)}>Resources</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/FAQs" onClick={() => setOpen(false)}>FAQs</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/Contact" onClick={() => setOpen(false)}>Contact</Link>
    </Nav>
  </Navbar.Collapse>, [setOpen]);

  return <Navbar bg="navbar" expand="lg" sticky="top" expanded={open}>
    <Container fluid="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={()=> setOpen(!open)} />
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
    <TmaNavbar />
    <Container fluid>
      <div className="App-header">
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
          <Route path="/FAQs">
            <FAQsPage />
          </Route>
          <Route path="/Contact">
            <ContactPage />
          </Route>
          <Route path="">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Container>
  </Router>
}