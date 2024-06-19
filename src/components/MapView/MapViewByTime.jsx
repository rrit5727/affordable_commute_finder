import React, { useState } from 'react';
import './MapView.css'; // Import your CSS file

const MapViewByTime = ({ onSelectTime }) => {
  const [activeButton, setActiveButton] = useState('all'); // Default active button to 'all'

  const handleButtonClick = (timeBand) => {
    onSelectTime(timeBand);
    setActiveButton(timeBand); // Set active button state
  };

  return (
    <div className="time-filter">
      <button
        className={activeButton === 'all' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('all')}
      >
        All
      </button>
      <button
        className={activeButton === 'fifteenMinute' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('fifteenMinute')}
      >
        15 mins
      </button>
      <button
        className={activeButton === 'thirtyMinute' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('thirtyMinute')}
      >
        30 mins
      </button>
      <button
        className={activeButton === 'fortyFiveMinute' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('fortyFiveMinute')}
      >
        45 mins
      </button>
      <button
        className={activeButton === 'sixtyMinute' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('sixtyMinute')}
      >
        60 mins
      </button>
      <button
        className={activeButton === 'seventyFiveMinute' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('seventyFiveMinute')}
      >
        75 mins
      </button>
      <button
        className={activeButton === 'ninetyMinute' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('ninetyMinute')}
      >
        90 mins
      </button>
    </div>
  );
};

export default MapViewByTime;