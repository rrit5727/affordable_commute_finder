import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const MapView = ({ fifteenMinute, thirtyMinute, fortyFiveMinute, sixtyMinute }) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

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
    markersRef.current = []; // Clear the array

    const allProperties = [
      ...fifteenMinute,
      ...thirtyMinute,
      ...fortyFiveMinute,
      ...sixtyMinute,
    ];

    // Add new markers
    for (const property of allProperties) {
      if (property.propertyData && property.propertyData.coordinates) {
        let { lat, lon } = property.propertyData.coordinates;

        // Check if coordinates are already parsed
        if (typeof lat === 'string' && typeof lon === 'string') {
          // Coordinates are in string format, parse them
          lat = parseFloat(lat);
          lon = parseFloat(lon);
        }

        const marker = L.marker([lat, lon]).addTo(leafletMapRef.current);
        markersRef.current = markersRef.current.concat(marker); // Update without mutation
      }
    }
  }, [fifteenMinute, thirtyMinute, fortyFiveMinute, sixtyMinute]);

  return <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapView;