// src/services/tomTomService.js
const API_KEY = 'cOAsAyvJ5BIZW2TAK2SxZIjmt5moKDN2';
const BASE_URL = 'https://api.tomtom.com';

export const fetchChargingStations = async (lat, lon, radius = 5000, onlyAvailable = false) => {
  try {
    // TomTom EV Charging Stations API
    const url = `${BASE_URL}/search/2/categorySearch/electric%20vehicle%20station.json?lat=${lat}&lon=${lon}&radius=${radius}&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch charging stations');
    }
    
    const data = await response.json();
    
    // Filter stations based on availability if requested
    let stations = data.results.map(result => ({
      id: result.id,
      name: result.poi.name || 'Unnamed Station',
      address: result.address.freeformAddress || '',
      latitude: result.position.lat,
      longitude: result.position.lon,
      available: result.poi.availableChargePoints !== undefined ? 
                result.poi.availableChargePoints > 0 : 
                undefined,
      totalPoints: result.poi.totalChargePoints,
      availablePoints: result.poi.availableChargePoints,
      connectorTypes: result.poi.chargingPoints?.map(point => point.connectorType) || []
    }));
    
    if (onlyAvailable) {
      stations = stations.filter(station => station.available === true);
    }
    
    return stations;
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    throw error;
  }
};

export const getStationDetails = async (stationId) => {
  try {
    const url = `${BASE_URL}/search/2/poiDetails.json?key=${API_KEY}&id=${stationId}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch station details');
    }
    
    const data = await response.json();
    return {
      id: data.id,
      name: data.poi.name || 'Unnamed Station',
      address: data.address.freeformAddress || '',
      latitude: data.position.lat,
      longitude: data.position.lon,
      available: data.poi.availableChargePoints !== undefined ? 
                data.poi.availableChargePoints > 0 : 
                undefined,
      totalPoints: data.poi.totalChargePoints,
      availablePoints: data.poi.availableChargePoints,
      connectorTypes: data.poi.chargingPoints?.map(point => point.connectorType) || [],
      openingHours: data.poi.openingHours || 'Information not available'
    };
  } catch (error) {
    console.error('Error fetching station details:', error);
    throw error;
  }
};
