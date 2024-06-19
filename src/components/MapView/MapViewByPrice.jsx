import React from 'react';
import './MapView.css';

const MapViewByPrice = ({ onSelectPrice }) => {
  const [activeButton, setActiveButton] = React.useState('all'); // Default active button to 'all'

  const handleButtonClick = (priceBand) => {
    onSelectPrice(priceBand === 'all' ? null : priceBand); // Pass null to reset filter, otherwise pass selected price band
    setActiveButton(priceBand); // Set active button state
  };

  return (
    <div className="price-filter">
      <button
        className={activeButton === 'all' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('all')}
      >
        All
      </button>
      <button
        className={activeButton === '&lt;$1M' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('&lt;$1M')}
      >
        {'<$1M'}
      </button>
      <button
        className={activeButton === '$1M-$1.5M' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('$1M-$1.5M')}
      >
        $1M-$1.5M
      </button>
      <button
        className={activeButton === '$1.5M-$2M' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('$1.5M-$2M')}
      >
        $1.5M-$2M
      </button>
      <button
        className={activeButton === '$2M-$2.5M' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('$2M-$2.5M')}
      >
        $2M-$2.5M
      </button>
      <button
        className={activeButton === '$2.5M-$3M' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('$2.5M-$3M')}
      >
        $2.5M-$3M
      </button>
      <button
        className={activeButton === '&gt;$3M' ? 'button active' : 'button'}
        onClick={() => handleButtonClick('&gt;$3M')}
      >
        {'>$3M'}
      </button>
    </div>
  );
};

export default MapViewByPrice;