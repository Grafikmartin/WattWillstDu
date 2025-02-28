// src/services/openChargeMapService.js
const OPENCHARGEMAP_API_KEY = "0a485624-a5fd-4ed8-b732-4875ee04760f";
const API_BASE_URL = "https://api.openchargemap.io/v3/poi";

export async function fetchChargingStations({
  latitude,
  longitude,
  distance = 10, // Radius in km
  maxResults = 100,
  operatorIds = [],
  connectionTypeIds = [],
  minPowerKW = 0
}) {
  try {
    const params = new URLSearchParams({
      key: OPENCHARGEMAP_API_KEY,
      maxresults: maxResults,
      compact: false,
      verbose: false,
      distanceunit: 'km'
    });

    // Füge Standort und Radius hinzu, wenn vorhanden
    if (latitude && longitude) {
      params.append('latitude', latitude);
      params.append('longitude', longitude);
      params.append('distance', distance);
    }

    // Füge Operatoren-Filter hinzu, wenn vorhanden
    if (operatorIds.length > 0) {
      params.append('operatorid', operatorIds.join(','));
    }

    // Füge Anschlusstyp-Filter hinzu, wenn vorhanden
    if (connectionTypeIds.length > 0) {
      params.append('connectiontypeid', connectionTypeIds.join(','));
    }

    // Füge Mindestleistung hinzu, wenn > 0
    if (minPowerKW > 0) {
      params.append('minpowerkw', minPowerKW);
    }

    const response = await fetch(`${API_BASE_URL}/?${params}`);
    
    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Ladestationen:", error);
    throw error;
  }
}

// Hilfsfunktion zum Abrufen von Anschlusstypen
export async function fetchConnectionTypes() {
  try {
    const params = new URLSearchParams({
      key: OPENCHARGEMAP_API_KEY
    });
    
    const response = await fetch(`https://api.openchargemap.io/v3/referencedata/connectiontypes/?${params}`);
    
    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Anschlusstypen:", error);
    throw error;
  }
}

// Hilfsfunktion zum Abrufen von Netzbetreibern
export async function fetchOperators() {
  try {
    const params = new URLSearchParams({
      key: OPENCHARGEMAP_API_KEY
    });
    
    const response = await fetch(`https://api.openchargemap.io/v3/referencedata/operators/?${params}`);
    
    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Netzbetreiber:", error);
    throw error;
  }
}
