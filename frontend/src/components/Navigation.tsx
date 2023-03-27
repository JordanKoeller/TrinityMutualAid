import React, { useState, useContext } from 'react';

import {
  Navbar,
  Container,
  Nav,
  Image,
  NavDropdown,
} from 'react-bootstrap';


import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink as Link,
} from 'react-router-dom';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import NewsPage from '../pages/News';
import HomePage from '../pages/Home';
import FAQsPage from '../pages/Faqs';
import ResourcesPage from '../pages/Resources';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_MAP } from '../i18n';

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { EditorClientContext } from '../context/context';

const AuthPage = withAuthenticator(() => {
  return <HomePage />
});


const CollapsingNavigation: React.FC<{ t: any, setOpen: (v: boolean) => void, }> = ({ setOpen, t }) => {
  const ctx = useContext(EditorClientContext);
  const closeAll = () => {
    setOpen(false);
  }
  return <Navbar.Collapse>
    <Nav style={{ margin: 'auto' }}>
      <Link className="nav-link" activeClassName="nav-link-active" to="/News" onClick={closeAll}>{t('navbar.News')}</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/About" onClick={closeAll} >{t('navbar.About')}</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/Resources" onClick={closeAll} >{t('navbar.Resources')}</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/FAQs" onClick={closeAll}>{t('navbar.FAQs')}</Link>
      <Link className="nav-link" activeClassName="nav-link-active" to="/Contact" onClick={closeAll}>{t('navbar.Contact')}</Link>
      {ctx?.loggedIn() ?
        <Nav.Link as={AmplifySignOut} >Sign out</Nav.Link> : null
      }
    </Nav>
  </Navbar.Collapse>
}

export const TmaNavbar: React.FC = () => {

  const { t, i18n } = useTranslation(undefined, { useSuspense: false });

  const [open, setOpen] = useState(false);

  return <Navbar bg="navbar" expand="lg" sticky="top" expanded={open}>
    <Container fluid="xl" style={{ justifyContent: 'space-between' }}>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setOpen(!open)} />
      <Navbar.Brand as={() => <a href="/Home">
        <Image src="tma-logo-banner.png" alt="" id="tma-logo" />
      </a>}>
      </Navbar.Brand>
      <LanguageButton i18n={i18n} onSelect={() => setOpen(false)} />
      <CollapsingNavigation t={t} setOpen={setOpen} />
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
          <Route path="/Admin">
            <AuthPage />
          </Route>
          <Route path="">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Container>
  </Router>
}

const LanguageButton: React.FC<{ i18n: any, onSelect: () => void }> = ({ i18n, onSelect }) => {
  const changeLanguage = (langKey: string) => {
    i18n.changeLanguage(langKey);
    onSelect();
  }
  const currentLanguage: string = i18n.language in LANGUAGE_MAP ? i18n.language : 'en';

  return <NavDropdown
    id="language-dropdown"
    title={LANGUAGE_MAP[currentLanguage]}
    menuVariant="dark"
    className="language-dropdown"
  >
    <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
    <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
  </NavDropdown>
}
