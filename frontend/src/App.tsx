import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import './tma-styles.scss';
import { Footer } from './components/Footer';
import { TmaNavbar, TmaRouter } from './components/Navigation';

function App() {
  return (
    <div className="App">
        <TmaNavbar />
      <div id="App-body">
        <TmaRouter />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
