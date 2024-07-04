import React from 'react';
import './styles/App.css';
import Autocomplete from './Components/Autocomplete/Autocomplete';

function App() {
  return (
    <div className="app">
      <h1 className="title">Music Search Autocomplete</h1>
      <Autocomplete />
    </div>
  );
}

export default App;
