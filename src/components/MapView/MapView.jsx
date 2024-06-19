import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import MapViewByTime from './MapViewByTime';
import MapViewByPrice from './MapViewByPrice';

const secondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} mins`;
};

const formattedValue = (property) => {
  return property.propertyData.purchase_price.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
};

const formatAddress = (address) => {
  const addressParts = address.split(' ');
  return addressParts.map(part => part.trim().toLowerCase()).join('-');
};

const customIcon = L.icon({
  iconUrl: 'https://cdn4.iconfinder.com/data/icons/symbol-blue-set-1/100/Untitled-2-09-1024.png',
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

const MapView = ({
  fifteenMinute,
  thirtyMinute,
  fortyFiveMinute,
  sixtyMinute,
  seventyFiveMinute,
  ninetyMinute
}) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedTime, setSelectedTime] = useState('fifteenMinute'); // Default to fifteen minutes
  const [selectedPriceBand, setSelectedPriceBand] = useState(null); // Default to null
  const [isFilterByPrice, setIsFilterByPrice] = useState(false);

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

    // Aggregate properties based on selected time band or show all properties if no time filter is selected
    let propertiesToShow = [];
    if (selectedTime) {
      propertiesToShow = eval(selectedTime); // Using eval to access the correct time state dynamically
    } else {
      propertiesToShow = [
        ...fifteenMinute,
        ...thirtyMinute,
        ...fortyFiveMinute,
        ...sixtyMinute,
        ...seventyFiveMinute,
        ...ninetyMinute,
      ];
    }

    // Filter properties by selected price band
    const filteredProperties = filterByPrice(propertiesToShow, selectedPriceBand);

    // Add new markers
    markersRef.current = filteredProperties.map(property => {
      if (property.propertyData && property.propertyData.coordinates) {
        let { lat, lon } = property.propertyData.coordinates;

        // Check if coordinates are already parsed
        if (typeof lat === 'string' && typeof lon === 'string') {
          // Coordinates are in string format, parse them
          lat = parseFloat(lat);
          lon = parseFloat(lon);
        }

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(leafletMapRef.current);

        // Convert travel time to minutes (assuming property.properties[0].travel_time exists)
        const travelTimeInMinutes = property.properties[0]?.travel_time ? secondsToTime(property.properties[0].travel_time) : '';

        // Format the address
        const formattedAddress = formatAddress(property.propertyData.street_address);

        // Create a URL for the address
        const addressUrl = `https://www.domain.com.au/property-profile/${encodeURIComponent(formattedAddress)}-nsw-${property.propertyData.property_post_code}`;

        // Create a popup with property details
        const popupContent = `
          <p><strong><a href="${addressUrl}" target="_blank">${property.propertyData.address}</a></strong></p>
          <p><strong>Purchase Price:</strong> ${formattedValue(property)}</p>
          <p><strong>Travel Time:</strong> ${travelTimeInMinutes}</p>          
          <p><strong>Distance:</strong> ${property.properties[0]?.distance || 0} Km</p>
          <p><strong>Transportation:</strong> ${property.transportation}</p>
        `;

        marker.bindPopup(popupContent);

        return marker;
      }
      return null;
    }).filter(marker => marker !== null); // Filter out null values

  }, [fifteenMinute, thirtyMinute, fortyFiveMinute, sixtyMinute, seventyFiveMinute, ninetyMinute, selectedTime, selectedPriceBand]);

  const filterByPrice = (properties, priceBand) => {
    if (!priceBand) return properties; // Return all properties if no price band selected

    switch (priceBand) {
      case '&lt;$1M':
        return properties.filter(property => property.propertyData.purchase_price < 1_000_000);
      case '$1M-$1.5M':
        return properties.filter(
          property =>
            property.propertyData.purchase_price >= 1_000_000 && property.propertyData.purchase_price <= 1_500_000
        );
      case '$1.5M-$2M':
        return properties.filter(
          property =>
            property.propertyData.purchase_price >= 1_500_000 && property.propertyData.purchase_price <= 2_000_000
        );
      case '$2M-$2.5M':
        return properties.filter(
          property =>
            property.propertyData.purchase_price >= 2_000_000 && property.propertyData.purchase_price <= 2_500_000
        );
      case '$2.5M-$3M':
        return properties.filter(
          property =>
            property.propertyData.purchase_price >= 2_500_000 && property.propertyData.purchase_price <= 3_000_000
        );
      case '&gt;$3M':
        return properties.filter(property => property.propertyData.purchase_price > 3_000_000);
      default:
        return properties;
    }
  };

  const handleToggleFilterByPrice = () => {
    setIsFilterByPrice(prev => !prev); // Toggle between time and price filter views
    setSelectedTime(null); // Reset selected time
    setSelectedPriceBand(null); // Reset selected price band
  };

  return (
    <div>
      {!isFilterByPrice ? (
        <MapViewByTime onSelectTime={setSelectedTime} />
      ) : (
        <MapViewByPrice onSelectPrice={setSelectedPriceBand} />
      )}
      <button onClick={handleToggleFilterByPrice}>
        {isFilterByPrice ? 'View by Time' : 'View by Price'}
      </button>
      <div id="map" ref={mapRef} style={{ height: '600px', width: '100%' }} />
    </div>
  );
};

export default MapView;