import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Autocomplete.css'; // Stylesheet for autocomplete

function Autocomplete() {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.length > 0) {
      axios.get('../data/data.json') // Adjust the path to your JSON file
        .then(response => {
          const data = response.data;
          const filteredSuggestions = searchRecursively(data, query);
          setSuggestions(filteredSuggestions);
          setError(filteredSuggestions.length === 0 ? 'No matching results found' : null);
        })
        .catch(() => {
          setError('Failed to fetch suggestions');
        });
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [query]);

  const handleSelect = (selectedSuggestion) => {
    setQuery(selectedSuggestion);
    setSuggestions([]);
  };

  // Function to highlight matching part of the suggestion
  const highlightMatch = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        className="search-box"
        placeholder="Search music..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelect(suggestion)}>
              {highlightMatch(suggestion, query)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;

const searchRecursively = (data, query) => {
  let results = [];
  data.forEach(artist => {
    if (artist.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(artist.name);
    }
    artist.albums.forEach(album => {
      if (album.title.toLowerCase().includes(query.toLowerCase())) {
        results.push(album.title);
      }
      album.songs.forEach(song => {
        if (song.title.toLowerCase().includes(query.toLowerCase())) {
          results.push(song.title);
        }
      });
    });
  });
  return results;
};
