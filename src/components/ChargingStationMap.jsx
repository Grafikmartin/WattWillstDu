// src/components/ChargingStationMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { getStationDetails } from '../services/tomTomService';
import 'leaflet/dist/leaflet.css';
import './ChargingStationMap.css';
import StationDetailsModal from './StationDetailsModal';

// Importieren Sie ein benutzerdefiniertes Marker-Icon
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet Icon-Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChargingStationMap({ stations, center, zoom }) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkerClick = async (station) => {
    try {
      setIsLoading(true);
      setSelectedStation(station);
      
      // Laden Sie detaillierte Informationen, wenn verfügbar
      if (station.id) {
        const details = await getStationDetails(station.id);
        setSelectedStation(prev => ({ ...prev, ...details }));
      }
      
      setShowModal(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Fehler beim Laden der Stationsdetails:", err);
      setIsLoading(false);
      // Zeigen Sie das Modal trotzdem mit den grundlegenden Informationen an
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStation(null);
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        key={`${center[0]}-${center[1]}-${zoom}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {stations.map(station => (
          <Marker 
            key={station.id}
            position={[station.latitude, station.longitude]}
            eventHandlers={{
              click: () => handleMarkerClick(station)
            }}
          >
            <Popup>
              <div className="station-popup">
                <h3>{station.name}</h3>
                <p>{station.address}</p>
                <button 
                  className="details-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(station);
                  }}
                >
                  Details anzeigen
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showModal && selectedStation && (
        <StationDetailsModal 
          station={selectedStation} 
          onClose={closeModal} 
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default ChargingStationMap;
