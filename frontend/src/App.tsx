import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';


import './tma-styles.scss';
import { Footer } from './components/Footer';
import { TmaNavbar, TmaRouter } from './components/Navigation';
import EditorClient, { useEditorClient } from './context/client';
import { EditorClientContext } from './context/context';


import Amplify, { Auth } from 'aws-amplify';

import { config } from './aws-config';


Auth.configure(config);
Amplify.configure(config);

function App() {

    const client = useEditorClient();

    return (
        <EditorClientContext.Provider value={client}>
            <div className="App">
                <TmaRouter />
                <div>
                    <Footer />
                </div>
            </div>
        </EditorClientContext.Provider>
    );
}


export default App;
