import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Autocomplete.css'; // Import the stylesheet for the autocomplete component

function Autocomplete() {
  // State to hold suggestions, user query, and error messages
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  // Effect to fetch suggestions whenever the query changes
  useEffect(() => {
    if (query.length > 0) {
      // Fetch data from the JSON file
      axios.get('../data/data.json') // Adjust the path to your JSON file
        .then(response => {
          const data = response.data;
          // Filter suggestions based on the user query
          const filteredSuggestions = searchRecursively(data, query);
          setSuggestions(filteredSuggestions);
          // Set an error message if no suggestions are found
          setError(filteredSuggestions.length === 0 ? 'No matching results found' : null);
        })
        .catch(() => {
          // Handle errors during the fetch operation
          setError('Failed to fetch suggestions');
        });
    } else {
      // Reset suggestions and error message if query is empty
      setSuggestions([]);
      setError(null);
    }
  }, [query]);

  // Function to handle selection of a suggestion
  const handleSelect = (selectedSuggestion) => {
    setQuery(selectedSuggestion);
    setSuggestions([]);
  };

  // Function to highlight matching parts of the suggestion
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

// Function to search the data recursively based on the user query
const searchRecursively = (data, query) => {
  let results = [];
  data.forEach(artist => {
    // Check if the artist name matches the query
    if (artist.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(artist.name);
    }
    artist.albums.forEach(album => {
      // Check if the album title matches the query
      if (album.title.toLowerCase().includes(query.toLowerCase())) {
        results.push(album.title);
      }
      album.songs.forEach(song => {
        // Check if the song title matches the query
        if (song.title.toLowerCase().includes(query.toLowerCase())) {
          results.push(song.title);
        }
      });
    });
  });
  return results;
};
