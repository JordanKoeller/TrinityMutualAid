import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';


import './tma-styles.scss';
import { Footer } from './components/Footer';
import { TmaRouter } from './components/Navigation';
import { useEditorClient } from './context/client';
import { EditorClientContext } from './context/context';


import Amplify, {Auth} from 'aws-amplify';

import {config} from './aws-config';


Auth.configure(config);
Amplify.configure(config);

function App() {

  const client = useEditorClient();

  return (
    <EditorClientContext.Provider value={client}>
      <div className="App">
        <div id="App-body">
          <TmaRouter />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </EditorClientContext.Provider>
  );
}


export default App;
