import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import ResultPage from '../../pages/ResultPage/ResultPage';

const MapView = ({ properties }) => {
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!leafletMapRef.current) {
          leafletMapRef.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(leafletMapRef.current);
        }

        const map = leafletMapRef.current;

         // Clear previous markers before adding new ones
         while (markersRef.current.length > 0) {
            const marker = markersRef.current.pop();
            map.removeLayer(marker);
        }

        // Add new markers
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            const { lat, lon } = property.propertyData.coordinates;
            const marker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`<b>${property.propertyData.address}</b><br />${property.propertyData.purchase_price}`);
            markersRef.current.push(marker);
        }

        // Cleanup function
        return () => {
            while (markersRef.current.length > 0) {
                const marker = markersRef.current.pop();
                map.removeLayer(marker);
            }
        };
    }, [properties]);

    return <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapView;