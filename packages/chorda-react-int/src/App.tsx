import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChordaComponent, ChordaComponent2, ChordaComponent3, TestContext } from './chorda';



const handleClick = () => {

}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <TestContext.Provider value={{i18n: 'en'}}>
          <ChordaComponent2/>
        </TestContext.Provider>
        <button onClick={handleClick}>Test button</button>
      </header>
    </div>
  );
}

export default App;
