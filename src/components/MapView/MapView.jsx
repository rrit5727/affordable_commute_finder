import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const MapView = ({ fifteenMinute, thirtyMinute, fortyFiveMinute, sixtyMinute }) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedResults, setSelectedResults] = useState(fifteenMinute);

  useEffect(() => {
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([-33.8688, 151.2093], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMapRef.current);
    }

    // Remove existing markers
    for (const marker of markersRef.current) {
      marker.remove();
    }

    // Ensure selectedResults is an array
    const resultsArray = Array.isArray(selectedResults) ? selectedResults : [];

    // Add new markers
    markersRef.current = resultsArray.map(property => {
      if (property.propertyData && property.propertyData.coordinates) {
        let { lat, lon } = property.propertyData.coordinates;

        // Check if coordinates are already parsed
        if (typeof lat === 'string' && typeof lon === 'string') {
          // Coordinates are in string format, parse them
          lat = parseFloat(lat);
          lon = parseFloat(lon);
        }

        const marker = L.marker([lat, lon]).addTo(leafletMapRef.current);
        return marker;
      }
      return null;
    }).filter(marker => marker !== null); // Filter out null values

  }, [selectedResults]);

  return (
    <div>
      <div>
        <button onClick={() => setSelectedResults(fifteenMinute)}>Within 15 mins</button>
        <button onClick={() => setSelectedResults(thirtyMinute)}>Within 30 mins</button>
        <button onClick={() => setSelectedResults(fortyFiveMinute)}>Within 45 mins</button>
        <button onClick={() => setSelectedResults(sixtyMinute)}>Within 60 mins</button>
        <button onClick={() => setSelectedResults([])}>Clear</button>
        {/* Add more buttons for different time intervals */}
      </div>
      <div id="map" ref={mapRef}  />
    </div>
  );
};

export default MapView;