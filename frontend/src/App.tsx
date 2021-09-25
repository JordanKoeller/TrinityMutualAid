import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { Footer } from './components/Footer';
import { TmaNavbar, TmaRouter } from './components/Routing';

function App() {
  return (
    <div className="App">
        <TmaNavbar />
      <body className="App-header">
        <TmaRouter />
      </body>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
