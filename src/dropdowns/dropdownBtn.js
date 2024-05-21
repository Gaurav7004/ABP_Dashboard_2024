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
        {selectedOption
          ? selectedOption.label
          : options.length === 0
            ? '-- select --'
            : '-- select --'}
      </button>

      {showPopover && options && Array.isArray(options) && ( // Check if options is an array
        <div className="popover-content">
          {options.length === 0 ? (
            <div className="option-container" style={{ fontSize: '1.2vw' }}>
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div key={option.value} className="option-container" style={{ fontSize: '1.2vw' }}>
                <input
                  type="radio"
                  id={option.value}
                  checked={option === selectedOption}
                  onChange={() => handleOptionSelect(option)}
                />
                <label className="option-label" htmlFor={option.value}>{option.label}</label>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
