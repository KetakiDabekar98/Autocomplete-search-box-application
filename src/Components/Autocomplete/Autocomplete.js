import React, { useState, useEffect } from 'react';
import './Autocomplete.css';

function Autocomplete() {


  return (
    <div className="autocomplete">
      <input
        type="text"
        className="search-box"
        placeholder="Search music..."
      />
    </div>
  );
}

export default Autocomplete;
