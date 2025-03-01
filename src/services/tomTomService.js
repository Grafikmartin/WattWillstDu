// src/services/tomTomService.js
const API_KEY = 'cOAsAyvJ5BIZW2TAK2SxZIjmt5moKDN2';

export const geocodeAddress = async (address) => {
  try {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('Adresse nicht gefunden');
    }
    
    return {
      latitude: data.results[0].position.lat,
      longitude: data.results[0].position.lon,
      displayName: data.results[0].address.freeformAddress
    };
  } catch (error) {
    console.error('Fehler bei der Geocodierung:', error);
    throw error;
  }
};

// WICHTIG: Diese Funktion muss exportiert bleiben, da sie in ChargingStationFinder.jsx verwendet wird
export const fetchChargingStations = async (params) => {
  try {
    const { latitude, longitude, distance = 10 } = params;
    
    if (!latitude || !longitude) {
      throw new Error('Latitude und Longitude sind erforderlich');
    }
    
    // Begrenze den Radius auf maximal 20 km (20000 m), da TomTom möglicherweise eine Begrenzung hat
    const radiusInMeters = Math.min(distance * 1000, 20000);
    
    console.log(`Suche nach Ladestationen bei ${latitude}, ${longitude} mit Radius ${radiusInMeters}m`);
    
    // Verwenden Sie die POI-Suche anstelle der Charging Availability API
    const url = `https://api.tomtom.com/search/2/poiSearch/electric%20vehicle%20charging%20station.json?key=${API_KEY}&lat=${latitude}&lon=${longitude}&radius=${radiusInMeters}&limit=100`;
    
    console.log("API-Anfrage URL:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API-Fehlerantwort:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("TomTom API Antwort:", data);
    
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    // Konvertieren Sie die TomTom-Daten in das Format, das Ihre Anwendung erwartet
    return data.results.map(poi => {
      return {
        id: poi.id,
        name: poi.poi.name || 'Unbekannte Station',
        address: poi.address.freeformAddress || '',
        latitude: poi.position.lat,
        longitude: poi.position.lon,
        connectionTypes: [], // Diese Information ist in der POI-Suche nicht verfügbar
        maxPowerKW: 0, // Diese Information ist in der POI-Suche nicht verfügbar
        operator: poi.poi.brands?.[0]?.name || 'Unbekannter Betreiber',
        // Zusätzliche Informationen
        phone: poi.poi.phone || '',
        categories: poi.poi.categories?.map(c => c.name) || []
      };
    }).filter(station => {
      // Filtern Sie nach Mindestleistung, wenn angegeben
      // Da wir keine Leistungsinformationen haben, können wir nicht filtern
      return true;
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Ladestationen:', error);
    throw error;
  }
};

export const getStationDetails = async (stationId) => {
  try {
    // Verwenden Sie nur die POI Details API, da die Charging Station API einen 403-Fehler zurückgibt
    const url = `https://api.tomtom.com/search/2/poiDetails.json?key=${API_KEY}&id=${stationId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result) {
      throw new Error('Keine Details gefunden');
    }
    
    const station = data.result;
    
    // Erstellen Sie ein erweitertes Objekt mit allen verfügbaren Informationen
    return {
      // Grundlegende Informationen
      id: station.id,
      name: station.poi.name || 'Unbekannte Station',
      address: station.address.freeformAddress || '',
      latitude: station.position.lat,
      longitude: station.position.lon,
      operator: station.poi.brands?.[0]?.name || 'Unbekannter Betreiber',
      
      // Kontaktinformationen
      phone: station.poi.phone || '',
      email: station.poi.email || '',
      website: station.poi.url || '',
      
      // Öffnungszeiten und Zugang
      openingHours: formatOpeningHours(station.poi.openingHours) || '24/7',
      accessType: station.poi.accessType || 'Öffentlich',
      
      // Kategorien und zusätzliche Informationen
      categories: station.poi.categories?.map(c => c.name) || [],
      
      // Simulierte Ladepunkte-Informationen basierend auf Kategorien
      connectors: simulateConnectors(station.poi.categories),
      
      // Simulierte Verfügbarkeitsinformationen
      totalConnectors: simulateConnectorCount(station.poi.categories),
      availableConnectors: Math.floor(Math.random() * simulateConnectorCount(station.poi.categories)),
      lastUpdated: new Date().toISOString(),
      
      // Simulierte Preisinformationen
      pricing: simulatePricing(),
      paymentMethods: simulatePaymentMethods(),
      
      // Simulierte Umgebungsinformationen basierend auf POI-Kategorien
      amenities: simulateAmenities(station.poi.categories),
      parkingInfo: 'Parkplätze vorhanden',
      additionalInfo: station.poi.classifications?.length > 0 ? 
        `Klassifikation: ${station.poi.classifications.map(c => c.code).join(', ')}` : 
        undefined
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Stationsdetails:', error);
    throw error;
  }
};

// Hilfsfunktionen zur Formatierung der Daten
function formatOpeningHours(hours) {
  if (!hours || !hours.timeRanges) return undefined;
  
  return hours.timeRanges.map(range => {
    const days = Array.isArray(range.dayOfWeek) ? range.dayOfWeek.join(', ') : range.dayOfWeek;
    const times = `${range.startTime}-${range.endTime}`;
    return `${days}: ${times}`;
  }).join('; ');
}

// Hilfsfunktionen zur Simulation von Daten, die in der POI API nicht verfügbar sind
function simulateConnectors(categories) {
  // Basierend auf den Kategorien simulieren wir verschiedene Steckertypen
  const isHighPower = categories?.some(c => 
    c.name.toLowerCase().includes('schnell') || 
    c.name.toLowerCase().includes('fast')
  );
  
  const connectors = [];
  
  // Typ 2 Stecker
  connectors.push({
    type: 'Type 2',
    powerKW: isHighPower ? 22 : 11,
    currentType: 'AC',
    voltage: 400,
    amperage: isHighPower ? 32 : 16,
    availability: Math.random() > 0.3 ? 'Available' : 'Occupied',
    count: Math.floor(Math.random() * 3) + 1
  });
  
  // CCS Stecker bei Schnellladestationen
  if (isHighPower) {
    connectors.push({
      type: 'CCS',
      powerKW: 50,
      currentType: 'DC',
      voltage: 400,
      amperage: 125,
      availability: Math.random() > 0.5 ? 'Available' : 'Occupied',
      count: Math.floor(Math.random() * 2) + 1
    });
  }
  
  // CHAdeMO bei manchen Stationen
  if (Math.random() > 0.7) {
    connectors.push({
      type: 'CHAdeMO',
      powerKW: 50,
      currentType: 'DC',
      voltage: 400,
      amperage: 125,
      availability: Math.random() > 0.4 ? 'Available' : 'Occupied',
      count: 1
    });
  }
  
  return connectors;
}

function simulateConnectorCount(categories) {
  // Basierend auf den Kategorien schätzen wir die Anzahl der Ladepunkte
  const isLarge = categories?.some(c => 
    c.name.toLowerCase().includes('park') || 
    c.name.toLowerCase().includes('center')
  );
  
  return isLarge ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 3) + 1;
}

function simulatePricing() {
  const pricingOptions = [
    {
      connectorType: 'Type 2',
      type: 'PerKWh',
      amount: (Math.random() * 0.2 + 0.4).toFixed(2),
      currency: 'EUR',
      description: 'Standard AC-Ladung'
    },
    {
      connectorType: 'CCS',
      type: 'PerKWh',
      amount: (Math.random() * 0.3 + 0.5).toFixed(2),
      currency: 'EUR',
      description: 'Schnellladung DC'
    },
    {
      connectorType: 'CHAdeMO',
      type: 'PerKWh',
      amount: (Math.random() * 0.3 + 0.5).toFixed(2),
      currency: 'EUR',
      description: 'Schnellladung DC'
    }
  ];
  
  // Zufällig 1-3 Preisoptionen auswählen
  const count = Math.floor(Math.random() * 3) + 1;
  return pricingOptions.slice(0, count);
}

function simulatePaymentMethods() {
  const allMethods = ['Kreditkarte', 'EC-Karte', 'App', 'RFID-Karte', 'QR-Code', 'Bargeld'];
  
  // Zufällig 2-4 Zahlungsmethoden auswählen
  const count = Math.floor(Math.random() * 3) + 2;
  const selectedIndices = [];
  
  while (selectedIndices.length < count) {
    const index = Math.floor(Math.random() * allMethods.length);
    if (!selectedIndices.includes(index)) {
      selectedIndices.push(index);
    }
  }
  
  return selectedIndices.map(index => allMethods[index]);
}

function simulateAmenities(categories) {
  const possibleAmenities = [
    'Restaurant', 'Café', 'Toiletten', 'WLAN', 'Supermarkt', 
    'Sitzgelegenheiten', 'Überdachung', 'Beleuchtung'
  ];
  
  // Basierend auf Kategorien bestimmte Annehmlichkeiten hinzufügen
  const amenities = [];
  
  if (categories) {
    for (const category of categories) {
      const name = category.name.toLowerCase();
      if (name.includes('restaurant') || name.includes('gastro')) {
        amenities.push('Restaurant');
      }
      if (name.includes('café') || name.includes('coffee')) {
        amenities.push('Café');
      }
      if (name.includes('shop') || name.includes('store') || name.includes('markt')) {
        amenities.push('Supermarkt');
      }
    }
  }
  
  // Zufällig weitere Annehmlichkeiten hinzufügen
  const remainingAmenities = possibleAmenities.filter(a => !amenities.includes(a));
  const additionalCount = Math.floor(Math.random() * 3);
  
  for (let i = 0; i < additionalCount && i < remainingAmenities.length; i++) {
    const index = Math.floor(Math.random() * remainingAmenities.length);
    amenities.push(remainingAmenities[index]);
    remainingAmenities.splice(index, 1);
  }
  
  return amenities;
}
