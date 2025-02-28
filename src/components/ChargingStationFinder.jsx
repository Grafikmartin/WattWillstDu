// src/components/ChargingStationFinder.jsx
import { useState, useEffect } from 'react';
import ChargingStationMap from './ChargingStationMap';
import { fetchChargingStations, fetchConnectionTypes, fetchOperators } from '../services/openChargeMapService';
import './ChargingStationFinder.css';

function ChargingStationFinder() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    latitude: null,
    longitude: null,
    distance: 10,
    operatorIds: [],
    connectionTypeIds: [],
    minPowerKW: 0
  });
  const [address, setAddress] = useState('');
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [operators, setOperators] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.165691, 10.451526]); // Deutschland-Zentrum
  const [mapZoom, setMapZoom] = useState(6);

  // Lade Referenzdaten beim ersten Rendern
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [typesData, operatorsData] = await Promise.all([
          fetchConnectionTypes(),
          fetchOperators()
        ]);
        setConnectionTypes(typesData);
        setOperators(operatorsData);
      } catch (err) {
        setError("Fehler beim Laden der Referenzdaten");
        console.error(err);
      }
    };
    
    loadReferenceData();
  }, []);

  // Lade Ladestationen basierend auf Suchparametern
  useEffect(() => {
    const loadStations = async () => {
      // Nur suchen, wenn Koordinaten vorhanden sind
      if (!searchParams.latitude || !searchParams.longitude) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchChargingStations(searchParams);
        setStations(data);
      } catch (err) {
        setError("Fehler beim Laden der Ladestationen");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadStations();
  }, [searchParams]);

  // Funktion zur Geocodierung einer Adresse
  const geocodeAddress = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    try {
      // Nominatim API für Geocoding (kostenlos)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchParams(prev => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }));
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMapZoom(13);
      } else {
        setError("Adresse nicht gefunden");
      }
    } catch (err) {
      setError("Fehler bei der Adresssuche");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Verwenden des aktuellen Standorts
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolokalisierung wird von Ihrem Browser nicht unterstützt");
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchParams(prev => ({
          ...prev,
          latitude,
          longitude
        }));
        setMapCenter([latitude, longitude]);
        setMapZoom(13);
        setLoading(false);
      },
      (err) => {
        setError("Fehler beim Abrufen des Standorts: " + err.message);
        setLoading(false);
      }
    );
  };

  return (
    <div className="charging-station-finder">
      <h2>Ladestationen finden</h2>
      
      {/* Suchformular */}
      <div className="search-form">
        <div className="address-search">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse oder PLZ eingeben"
          />
          <button onClick={geocodeAddress} disabled={loading}>Suchen</button>
          <button onClick={useCurrentLocation} disabled={loading}>
            Aktuellen Standort verwenden
          </button>
        </div>
        
        <div className="search-options">
          <div className="radius-selector">
            <label>Umkreis: {searchParams.distance} km</label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchParams.distance}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                distance: Number(e.target.value)
              }))}
            />
          </div>
          
          <div className="power-filter">
            <label>Min. Leistung: {searchParams.minPowerKW} kW</label>
            <input
              type="range"
              min="0"
              max="350"
              step="10"
              value={searchParams.minPowerKW}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                minPowerKW: Number(e.target.value)
              }))}
            />
          </div>
          
          {/* Hier könnten weitere Filter für Anschlusstypen und Betreiber hinzugefügt werden */}
        </div>
      </div>
      
      {/* Fehlermeldung */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Ladeanzeige */}
      {loading && <div className="loading-indicator">Lade Daten...</div>}
      
      {/* Ergebnisanzeige */}
      <div className="results-info">
        {stations.length > 0 ? (
          <p>{stations.length} Ladestationen gefunden</p>
        ) : searchParams.latitude ? (
          <p>Keine Ladestationen im angegebenen Bereich gefunden</p>
        ) : null}
      </div>
      
      {/* Karte */}
      <ChargingStationMap 
        stations={stations} 
        center={mapCenter}
        zoom={mapZoom}
      />
    </div>
  );
}

export default ChargingStationFinder;
