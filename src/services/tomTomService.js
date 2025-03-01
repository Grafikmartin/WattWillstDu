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
    
    return {
      id: station.id,
      name: station.poi.name || 'Unbekannte Station',
      address: station.address.freeformAddress || '',
      latitude: station.position.lat,
      longitude: station.position.lon,
      openingHours: station.poi.openingHours?.timeRanges?.map(range => 
        `${range.dayOfWeek}: ${range.startTime}-${range.endTime}`
      ).join(', ') || '24/7',
      operator: station.poi.brands?.[0]?.name || 'Unbekannter Betreiber',
      phone: station.poi.phone || '',
      email: station.poi.email || '',
      categories: station.poi.categories?.map(c => c.name) || []
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Stationsdetails:', error);
    throw error;
  }
};
