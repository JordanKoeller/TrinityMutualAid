import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Container
} from 'react-bootstrap';
import './tma-styles.scss';
import { Footer } from './components/Footer';
import { TmaNavbar, TmaRouter } from './components/Navigation';

function App() {
  return (
    <div className="App">
        <TmaNavbar />
      <Container fluid>
      <div className="App-header">
        <TmaRouter />
      </div>
      </Container>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
