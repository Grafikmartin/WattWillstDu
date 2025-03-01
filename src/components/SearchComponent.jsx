// src/components/SearchComponent.jsx
import React, { useState } from 'react';
import './SearchComponent.css';

const SearchComponent = () => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Senden Sie ein benutzerdefiniertes Ereignis mit den Suchparametern
    const searchEvent = new CustomEvent('search-submitted', {
      detail: {
        location,
        radius,
        onlyAvailable
      }
    });
    
    window.dispatchEvent(searchEvent);
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">Standort:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Stadt, Adresse oder Postleitzahl"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="radius">Radius (m):</label>
          <input
            type="number"
            id="radius"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            min="1000"
            max="50000"
            step="1000"
          />
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="onlyAvailable"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          <label htmlFor="onlyAvailable">Nur verfügbare Stationen anzeigen</label>
        </div>
        
        <button type="submit" className="search-button">Suchen</button>
      </form>
    </div>
  );
};

export default SearchComponent;
