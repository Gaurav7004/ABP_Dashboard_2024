import React, { useState, useEffect } from 'react';
import './dropdownBtn.css'; // Import your CSS file for styling

const DropdownButton = ({ fetchDataEndpoint, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Replace the URL with your backend API endpoint that provides dropdown data
      const response = await fetch(fetchDataEndpoint);
      const data = await response.json();

      // Assuming the backend response is an array of options, update the state
      setOptions(data);
    } catch (error) {
      console.error('Error fetching data from the backend:', error);
    }
  };

  const handleOptionSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        Select an option
        <div className="dropdown-arrow"></div>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {/* Map through the options and render them as dropdown items */}
          {options.map((option) => (
            <p key={option.id} onClick={() => handleOptionSelect(option)}>
              {option.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
