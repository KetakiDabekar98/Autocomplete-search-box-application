import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Autocomplete.css';

function Autocomplete() {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchData = useCallback(
    debounce((query) => {
      if (query.length > 0) {
        axios.get('../data/data.json')
          .then(response => {
            const data = response.data;

            // Flatten the data to get all song titles from all artists and albums
            const allSongs = data.reduce((acc, artist) => {
              artist.albums.forEach(album => {
                album.songs.forEach(song => {
                  acc.push(song.title);
                });
              });
              return acc;
            }, []);

            // Filter suggestions based on the query
            const filteredSuggestions = allSongs.filter(item =>
              item.toLowerCase().includes(query.toLowerCase())
            );

            setSuggestions(filteredSuggestions);
            setError(null);
          })
          .catch(error => {
            setError('Failed to fetch suggestions');
          });
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchData(query);
  }, [query, fetchData]);

  const highlightMatch = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? <mark key={index}>{part}</mark> : part
        )}
      </span>
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
      {suggestions.length > 0 ? (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{highlightMatch(suggestion, query)}</li>
          ))}
        </ul>
      ) : (
        query.length > 0 && <div className="no-suggestions">No suggestions found</div>
      )}
    </div>
  );
}

export default Autocomplete;
