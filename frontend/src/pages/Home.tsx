import React, { useContext } from 'react';
import { EditorClientContext } from '../context/context';

const Home: React.FC = () => {
  const context = useContext(EditorClientContext);

  return <h1>
    Redistributing wealth in the San Antonio community 
  </h1>
}

export default Home;