import React, { useState, useEffect } from 'react';
import './dropdownBtn.css';

const SingleSelectDropdown = ({ options, buttonText, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      onSelect(selectedOption.value); // Call the onSelect function with the selected value
    }
  }, [selectedOption, onSelect]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option === selectedOption ? null : option);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  return (
    <div className="dropdown" onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
      <button style={{fontSize: '20px'}} className="dropdown-toggle">
        {selectedOption ? selectedOption.label : buttonText} 
      </button>
      {showPopover && (
        <div className="popover-content">
          {options.map((option) => (
            <div key={option.value} className="option-container">
              <input
                type="radio"
                id={option.value}
                checked={option === selectedOption}
                onChange={() => handleOptionSelect(option)}
              />
              <label className="option-label" htmlFor={option.value}>{option.label}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
