import React from 'react';
import './MapView.css';

const MapViewByTime = ({ onSelectTime }) => {
  const [activeButton, setActiveButton] = React.useState(null); // Default active button to null

  const handleButtonClick = (timeBand) => {
    onSelectTime(timeBand);
    setActiveButton(timeBand); // Set active button state
  };

  return (
    <div className="time-filter">
      <button className={activeButton === null ? 'button active' : 'button'} onClick={() => handleButtonClick(null)}>
        All
      </button>
      <button className={activeButton === 'fifteenMinute' ? 'button active' : 'button'} onClick={() => handleButtonClick('fifteenMinute')}>
        15 mins
      </button>
      <button className={activeButton === 'thirtyMinute' ? 'button active' : 'button'} onClick={() => handleButtonClick('thirtyMinute')}>
        30 mins
      </button>
      <button className={activeButton === 'fortyFiveMinute' ? 'button active' : 'button'} onClick={() => handleButtonClick('fortyFiveMinute')}>
        45 mins
      </button>
      <button className={activeButton === 'sixtyMinute' ? 'button active' : 'button'} onClick={() => handleButtonClick('sixtyMinute')}>
        60 mins
      </button>
      <button className={activeButton === 'seventyFiveMinute' ? 'button active' : 'button'} onClick={() => handleButtonClick('seventyFiveMinute')}>
        75 mins
      </button>
      <button className={activeButton === 'ninetyMinute' ? 'button active' : 'button'} onClick={() => handleButtonClick('ninetyMinute')}>
        90 mins
      </button>
    </div>
  );
};

export default MapViewByTime;