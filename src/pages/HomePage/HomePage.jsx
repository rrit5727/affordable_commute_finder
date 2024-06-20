import React, { useState, useEffect, useRef } from 'react';
import { properties } from '../../../seed';
import { RotatingTriangles } from 'react-loader-spinner';
import './HomePage.css';
import FilteredPage from '../FilteredPage/FilteredPage';
import axios from 'axios';

const HomePage = ({ search, sendInformation }) => {
  const [fifteenMinute, setFifteenMinute] = useState([]);
  const [thirtyMinute, setThirtyMinute] = useState([]);
  const [fortyFiveMinute, setFortyFiveMinute] = useState([]);
  const [sixtyMinute, setSixtyMinute] = useState([]);
  const [seventyFiveMinute, setSeventyFiveMinute] = useState([]);
  const [ninetyMinute, setNinetyMinute] = useState([]);
  const [address1, setAddress1] = useState('');
  const [transportation, setTransportation] = useState('driving');
  const [mappedResults, setMappedResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyType, setPropertyType] = useState('all');

  const apiKeyRef = useRef('');
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get('/api/api-key');
        apiKeyRef.current = response.data.apiKey;
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    fetchApiKey();
  }, []);

  const fetchCoordinates = async (address) => {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        const coordinates = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
        return coordinates;
      } else {
        throw new Error('Coordinates not found for the provided address.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };

  const fetchDistance = async (startingLocation, properties) => {
    const locationObjects = properties.map((property, index) => ({
      id: `other-location-${index}`,
      coords: {
        lat: property.coordinates?.lat || null, // Check for null values here
        lng: property.coordinates?.lon || null, // Check for null values here
      },
      propertyData: property,
      transportation,
    }));

    const requestBody = {
      locations: [
        {
          id: 'starting-location',
          coords: {
            lat: startingLocation.lat,
            lng: startingLocation.lon,
          },
        },
        ...locationObjects,
      ],
      departure_searches: [
        {
          id: 'Departure search',
          arrival_location_ids: locationObjects.map((location) => location.id),
          departure_location_id: 'starting-location',
          departure_time: new Date().toISOString(),
          travel_time: 5400,
          properties: ['travel_time', 'distance'],
          transportation: {
            type: transportation,
          },
        },
      ],
      arrival_searches: [],
    };

    try {
      const res = await fetch('https://api.traveltimeapp.com/v4/time-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKeyRef.current,
          'X-Application-Id': 'e9f7d35c',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      const results = Array.isArray(data.results)
        ? data.results
        : [data.results];

      setMappedResults(
        results.map((result) => {
          const locations = result.locations.map((location) => {
            const locationObject = locationObjects.find(
              (obj) => obj.id === location.id
            );
            return {
              ...location,
              propertyData: locationObject ? locationObject.propertyData : null,
              transportation,
            };
          });
          return {
            ...result,
            locations,
          };
        })
      );
    } catch (error) {
      console.error('Error fetching distance:', error);
    }
  };

  useEffect(
    function () {
      async function showResults(mappedResults) {
        let fifteenMinuteArray = [];
        let thirtyMinuteArray = [];
        let fortyfiveMinuteArray = [];
        let sixtyMinuteArray = [];
        let seventyFiveMinuteArray = [];
        let ninetyMinuteArray = [];


        mappedResults.forEach((result) =>
          result.locations.forEach((location) =>
            location.properties.forEach((a) => {
              if (a.travel_time < 900) {
                fifteenMinuteArray.push(location);
                fifteenMinuteArray.sort(
                  (a, b) =>
                    a.propertyData.purchase_price -
                    b.propertyData.purchase_price
                );
              } else if (a.travel_time >= 900 && a.travel_time < 1800) {
                thirtyMinuteArray.push(location);
                thirtyMinuteArray.sort(
                  (a, b) =>
                    a.propertyData.purchase_price -
                    b.propertyData.purchase_price
                );
              } else if (a.travel_time >= 1800 && a.travel_time < 2700) {
                fortyfiveMinuteArray.push(location);
                fortyfiveMinuteArray.sort(
                  (a, b) =>
                    a.propertyData.purchase_price -
                    b.propertyData.purchase_price
                );
              } else if (a.travel_time >= 2700 && a.travel_time < 3600) {
                sixtyMinuteArray.push(location);
                sixtyMinuteArray.sort(
                  (a, b) =>
                    a.propertyData.purchase_price -
                    b.propertyData.purchase_price
                );
              } else if (a.travel_time >= 3600 && a.travel_time < 4500) { // 75 minutes
                seventyFiveMinuteArray.push(location);
                seventyFiveMinuteArray.sort(
                  (a, b) =>
                    a.propertyData.purchase_price -
                    b.propertyData.purchase_price
                );
              } else if (a.travel_time >= 4500 && a.travel_time < 5400) { // 90 minutes
                ninetyMinuteArray.push(location);
                ninetyMinuteArray.sort(
                  (a, b) =>
                    a.propertyData.purchase_price -
                    b.propertyData.purchase_price
                );
              }
            })
          )
        );
        setFifteenMinute(fifteenMinuteArray);
        setThirtyMinute(thirtyMinuteArray);
        setFortyFiveMinute(fortyfiveMinuteArray);
        setSixtyMinute(sixtyMinuteArray);
        setSeventyFiveMinute(seventyFiveMinuteArray);
        setNinetyMinute(ninetyMinuteArray);
      }
      showResults(mappedResults);
    },
    [mappedResults]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const startingLocation = await fetchCoordinates(address1);

    if (startingLocation) {
      // Filter properties based on the selected property type
      const filteredProperties =
        propertyType === 'all'
          ? properties
          : properties.filter((property) => {
              return propertyType === 'house'
                ? !property.strata_lot_number
                : !!property.strata_lot_number;
            });

      //fetchDistance on filtered properties i.e. 'all', 'house' or 'apartment'
      await fetchDistance(startingLocation, filteredProperties);
      setIsLoading(false);
      sendInformation();
    } else {
      console.log('Failed to fetch coordinates for one or both addresses.');
    }
  };

  return (
    <>
      {!search ? (
        <div className="search-container">
          <h2>Search properties by travel time</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="address1">Address:</label>
            <input
              id="address1"
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
              placeholder="Address"
            />
            <label htmlFor="transportation">Transportation:</label>
            <select
              id="transportation"
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
            >
              <option value="driving">Driving</option>
              <option value="public_transport">Public Transport</option>
              <option value="walking">Walking</option>
            </select>

            <label htmlFor="propertyType">Property Type:</label>
            <select
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              
              <option value="house">House</option>
              
            </select>
            <button className="button-search" type="submit">
              Show results
            </button>
          </form>
          <div className="loading">
            {isLoading ? (
              <RotatingTriangles
                visible={true}
                height="80"
                width="80"
                color="blue"
                ariaLabel="rotating-triangles-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : null}
          </div>
        </div>
      ) : (
        <FilteredPage
          fifteenMinute={fifteenMinute}
          thirtyMinute={thirtyMinute}
          fortyFiveMinute={fortyFiveMinute}
          sixtyMinute={sixtyMinute}
          seventyFiveMinute={seventyFiveMinute}
          ninetyMinute={ninetyMinute}


        />
      )}
    </>
  );
};
export default HomePage;

// comment
// comment