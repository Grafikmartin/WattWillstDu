// src/components/ChargingStationFinder.jsx
import { useState, useEffect } from 'react';
import ChargingStationMap from './ChargingStationMap';
import { fetchChargingStations, geocodeAddress } from '../services/tomTomService';
import './ChargingStationFinder.css';

function ChargingStationFinder() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    latitude: null,
    longitude: null,
    distance: 10,
    minPowerKW: 0
  });
  const [address, setAddress] = useState('');
  const [mapCenter, setMapCenter] = useState([51.165691, 10.451526]); // Deutschland-Zentrum
  const [mapZoom, setMapZoom] = useState(6);

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
        setError(`Fehler beim Laden der Ladestationen: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [searchParams]);

  // Funktion zur Geocodierung einer Adresse
  const handleGeocodeAddress = async () => {
    if (!address.trim()) return;

    setLoading(true);
    try {
      const result = await geocodeAddress(address);

      setSearchParams(prev => ({
        ...prev,
        latitude: result.latitude,
        longitude: result.longitude
      }));
      setMapCenter([result.latitude, result.longitude]);
      setMapZoom(13);
    } catch (err) {
      setError(`Fehler bei der Adresssuche: ${err.message}`);
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
      


      <div className="search-container">
      <h2 className="finder-title">Finde deine Ladestation</h2>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse oder PLZ eingeben"
            onKeyPress={(e) => e.key === 'Enter' && handleGeocodeAddress()}
          />
        </div>

        <button className="location-button" onClick={handleGeocodeAddress} disabled={loading}>
          Suchen
        </button>

        <button className="location-button" onClick={useCurrentLocation} disabled={loading}>
          Aktuellen Standort verwenden
        </button>

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
