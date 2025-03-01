// src/components/StationDetailsModal.jsx
import { useState } from 'react';
import './StationDetailsModal.css';

function StationDetailsModal({ station, onClose, isLoading }) {
  const [activeTab, setActiveTab] = useState('availability');

  // Hilfsfunktion zur Formatierung der Verfügbarkeit
  const getAvailabilityStatus = (connector) => {
    if (!connector) return 'Unbekannt';
    
    if (connector.availability === 'Available') return 'Verfügbar';
    if (connector.availability === 'Occupied') return 'Besetzt';
    if (connector.availability === 'OutOfService') return 'Außer Betrieb';
    if (connector.availability === 'Reserved') return 'Reserviert';
    
    return connector.availability || 'Unbekannt';
  };

  // Hilfsfunktion zur Formatierung der Preise
  const formatPrice = (price) => {
    if (!price) return 'Keine Preisangabe';
    
    if (price.type === 'PerKWh') {
      return `${price.amount} ${price.currency}/kWh`;
    } else if (price.type === 'PerMinute') {
      return `${price.amount} ${price.currency}/min`;
    } else if (price.type === 'PerSession') {
      return `${price.amount} ${price.currency}/Sitzung`;
    }
    
    return `${price.amount} ${price.currency}`;
  };

  return (
    <div className="modal-overlay">
      <div className="station-details-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        {isLoading ? (
          <div className="loading-spinner">Lade Daten...</div>
        ) : (
          <>
            <h2>{station.name}</h2>
            <p className="station-address">{station.address}</p>
            
            <div className="station-tabs">
              <div className="tab-headers">
                <button 
                  className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`}
                  onClick={() => setActiveTab('availability')}
                >
                  Verfügbarkeit
                </button>
                <button 
                  className={`tab-button ${activeTab === 'pricing' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pricing')}
                >
                  Kosten
                </button>
                <button 
                  className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`tab-button ${activeTab === 'amenities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('amenities')}
                >
                  Umgebung
                </button>
              </div>
              
              <div className="tab-content">
                {/* Verfügbarkeit Tab */}
                {activeTab === 'availability' && (
                  <div className="tab-panel">
                    <h3>Ladepunkte</h3>
                    {station.connectors && station.connectors.length > 0 ? (
                      <div className="connectors-grid">
                        {station.connectors.map((connector, index) => (
                          <div 
                            key={index} 
                            className={`connector-card ${
                              connector.availability === 'Available' ? 'available' : 
                              connector.availability === 'Occupied' ? 'occupied' : 
                              'unavailable'
                            }`}
                          >
                            <div className="connector-header">
                              <span className="connector-type">{connector.type || 'Unbekannt'}</span>
                              <span className={`connector-status status-${connector.availability?.toLowerCase() || 'unknown'}`}>
                                {getAvailabilityStatus(connector)}
                              </span>
                            </div>
                            <div className="connector-details">
                              <p><strong>Leistung:</strong> {connector.powerKW || connector.maxPowerKW || 'Unbekannt'} kW</p>
                              {connector.currentType && <p><strong>Stromtyp:</strong> {connector.currentType}</p>}
                              {connector.voltage && <p><strong>Spannung:</strong> {connector.voltage} V</p>}
                              {connector.amperage && <p><strong>Stromstärke:</strong> {connector.amperage} A</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Keine Informationen zu Ladepunkten verfügbar.</p>
                    )}
                    
                    <div className="availability-info">
                      <p><strong>Letzte Aktualisierung:</strong> {station.lastUpdated ? new Date(station.lastUpdated).toLocaleString() : 'Unbekannt'}</p>
                      {station.totalConnectors && <p><strong>Gesamtanzahl Ladepunkte:</strong> {station.totalConnectors}</p>}
                      {station.availableConnectors && <p><strong>Verfügbare Ladepunkte:</strong> {station.availableConnectors}</p>}
                    </div>
                  </div>
                )}
                
                {/* Kosten Tab */}
                {activeTab === 'pricing' && (
                  <div className="tab-panel">
                    <h3>Preise</h3>
                    {station.pricing && station.pricing.length > 0 ? (
                      <div className="pricing-info">
                        {station.pricing.map((price, index) => (
                          <div key={index} className="price-card">
                            <h4>{price.connectorType || 'Alle Anschlüsse'}</h4>
                            <p className="price-amount">{formatPrice(price)}</p>
                            {price.description && <p>{price.description}</p>}
                            {price.validFrom && price.validTo && (
                              <p className="price-validity">
                                Gültig von {new Date(price.validFrom).toLocaleDateString()} 
                                bis {new Date(price.validTo).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Keine Preisinformationen verfügbar.</p>
                    )}
                    
                    <div className="payment-methods">
                      <h3>Zahlungsmethoden</h3>
                      {station.paymentMethods && station.paymentMethods.length > 0 ? (
                        <ul className="payment-list">
                          {station.paymentMethods.map((method, index) => (
                            <li key={index}>{method}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>Keine Informationen zu Zahlungsmethoden verfügbar.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="tab-panel">
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-icon">🏢</span>
                        <span className="detail-label">Betreiber:</span>
                        <span className="detail-value">{station.operator || 'Unbekannt'}</span>
                      </div>
                      
                      {station.openingHours && (
                        <div className="detail-item">
                          <span className="detail-icon">🕒</span>
                          <span className="detail-label">Öffnungszeiten:</span>
                          <span className="detail-value">{station.openingHours}</span>
                        </div>
                      )}
                      
                      {station.phone && (
                        <div className="detail-item">
                          <span className="detail-icon">📞</span>
                          <span className="detail-label">Telefon:</span>
                          <span className="detail-value">{station.phone}</span>
                        </div>
                      )}
                      
                      {station.email && (
                        <div className="detail-item">
                          <span className="detail-icon">✉️</span>
                          <span className="detail-label">E-Mail:</span>
                          <span className="detail-value">{station.email}</span>
                        </div>
                      )}
                      
                      {station.website && (
                        <div className="detail-item">
                          <span className="detail-icon">🌐</span>
                          <span className="detail-label">Website:</span>
                          <span className="detail-value">
                            <a href={station.website} target="_blank" rel="noopener noreferrer">
                              {station.website}
                            </a>
                          </span>
                        </div>
                      )}
                      
                      {station.accessType && (
                        <div className="detail-item">
                          <span className="detail-icon">🔑</span>
                          <span className="detail-label">Zugang:</span>
                          <span className="detail-value">{station.accessType}</span>
                        </div>
                      )}
                    </div>
                    
                    {station.additionalInfo && (
                      <div className="additional-info">
                        <h3>Zusätzliche Informationen</h3>
                        <p>{station.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Umgebung Tab */}
                {activeTab === 'amenities' && (
                  <div className="tab-panel">
                    <h3>Einrichtungen in der Nähe</h3>
                    {station.amenities && station.amenities.length > 0 ? (
                      <div className="amenities-grid">
                        {station.amenities.map((amenity, index) => (
                          <div key={index} className="amenity-item">
                            <span className="amenity-icon">
                              {amenity.includes('Restaurant') ? '🍽️' : 
                               amenity.includes('Café') ? '☕' : 
                               amenity.includes('Shop') ? '🛒' : 
                               amenity.includes('Toilet') ? '🚻' : 
                               amenity.includes('WiFi') ? '📶' : '🏪'}
                            </span>
                            <span className="amenity-name">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Keine Informationen zu Einrichtungen in der Nähe verfügbar.</p>
                    )}
                    
                    {station.parkingInfo && (
                      <div className="parking-info">
                        <h3>Parkinformationen</h3>
                        <p>{station.parkingInfo}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="station-actions">
              <button className="action-button">
                <span className="icon">🗺️</span> Route planen
              </button>
              <button className="action-button">
                <span className="icon">⭐</span> Als Favorit speichern
              </button>
              <button className="action-button">
                <span className="icon">📱</span> Teilen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StationDetailsModal;
