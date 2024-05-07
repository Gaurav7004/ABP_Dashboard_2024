import React, { useState, useEffect } from 'react';
import './dropdownBtn.css';

const SingleSelectDropdown = ({ options, buttonText, onSelect }) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      onSelect(selectedOption.value); // Call the onSelect function with the selected value
    }
  }, [selectedOption]);

  useEffect(() => {
    // Set the initial selected option to the first option in the array
    if (!selectedOption && options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option === selectedOption ? null : option);
    setShowPopover(false); // Close the popover after selecting an option
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  return (
    <div className="dropdown" onClick={togglePopover}>
      <button style={{ fontSize: '1vw' }} className="dropdown-toggle">
        {selectedOption ? selectedOption.label : (typeof buttonText === 'object' ? buttonText.label : buttonText)}
      </button>

      {showPopover && (
        <div className="popover-content">
          {options.map((option) => (
            <div key={option.value} className="option-container" style={{ fontSize: '1.2vw' }}>
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
