// src/components/ChargingStationMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { getStationDetails } from '../services/tomTomService';
import 'leaflet/dist/leaflet.css';
import './ChargingStationMap.css';

function ChargingStationMap({ stations, center, zoom }) {
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [stationDetails, setStationDetails] = useState(null);

  const handleMarkerClick = async (stationId) => {
    try {
      setSelectedStationId(stationId);
      const details = await getStationDetails(stationId);
      setStationDetails(details);
    } catch (err) {
      console.error("Fehler beim Laden der Stationsdetails:", err);
    }
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
              click: () => handleMarkerClick(station.id)
            }}
          >
            <Popup>
              <div className="station-popup">
                <h3>{station.name}</h3>
                <p>{station.address}</p>
                
                <p>Betreiber: {station.operator || 'Unbekannt'}</p>
                
                {station.maxPowerKW > 0 && (
                  <p>Max. Leistung: {station.maxPowerKW} kW</p>
                )}
                
                {station.connectionTypes && station.connectionTypes.length > 0 && (
                  <p>Anschlusstypen: {station.connectionTypes.join(', ')}</p>
                )}
                
                {station.categories && station.categories.length > 0 && (
                  <p>Kategorien: {station.categories.join(', ')}</p>
                )}
                
                {stationDetails && selectedStationId === station.id && (
                  <div className="station-details">
                    <h4>Details:</h4>
                    {stationDetails.openingHours && (
                      <p>Öffnungszeiten: {stationDetails.openingHours}</p>
                    )}
                    {stationDetails.phone && (
                      <p>Telefon: {stationDetails.phone}</p>
                    )}
                    {stationDetails.email && (
                      <p>E-Mail: {stationDetails.email}</p>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ChargingStationMap;
