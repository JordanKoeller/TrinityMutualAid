import React from 'react';

import './tma-styles.scss';
import { Footer } from './components/Footer';
import { TmaRouter } from './components/Navigation';

function App() {
  return (
    <div className="App">
      <TmaRouter />
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
