import React, { useState, useEffect } from 'react';
import './MultipleSelectDropdown.css';

const MultipleSelectDropdown = ({ options, buttonText, setSelectedKPI }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const labels = selectedOptions.map(option => option.label);
    setSelectedLabels(labels);
    setSelectedKPI(labels); // Update selectedKPI whenever selectedOptions change
  }, [selectedOptions, setSelectedKPI]);

  const handleCheckboxChange = (option) => {
    if (selectedOptions.some((selectedOption) => selectedOption.label === option.label)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.label !== option.label));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options);
    }
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  console.log(selectedLabels);

  return (
    <div className="dropdown" onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
      <button className="dropdown-toggle">
        {buttonText} 
      </button>
      {showPopover && (
        <div className="popover-content">
          <input
            type="checkbox"
            checked={selectedOptions.length === options.length}
            onChange={handleSelectAll}
          />
          <label style={{ color: "red", fontSize: "20px" }}>Select All</label>
          {options.map((option) => (
            <div key={option.label} className="option-container">
              <input
                type="checkbox"
                checked={selectedOptions.some((selectedOption) => selectedOption.label === option.label)}
                onChange={() => handleCheckboxChange(option)}
              />
              <label className="option-label">{option.label}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleSelectDropdown;
