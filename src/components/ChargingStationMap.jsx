// src/components/ChargingStationMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix für das Marker-Icon-Problem in React
// (Ohne diesen Fix werden die Marker-Icons nicht korrekt angezeigt)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChargingStationMap({ stations = [], center = [51.165691, 10.451526], zoom = 6 }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map(station => (
        <Marker 
          key={station.ID} 
          position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
        >
          <Popup>
            <div>
              <h3>{station.AddressInfo.Title}</h3>
              <p>Adresse: {station.AddressInfo.AddressLine1}</p>
              <p>Stadt: {station.AddressInfo.Town}</p>
              <p>Anschlüsse: {station.Connections.length}</p>
              {station.Connections.map((conn, idx) => (
                <div key={idx}>
                  <small>
                    {conn.ConnectionType?.Title || 'Unbekannt'} - 
                    {conn.PowerKW ? `${conn.PowerKW} kW` : 'Leistung unbekannt'}
                  </small>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ChargingStationMap;
