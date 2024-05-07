import React, { useState, useEffect } from 'react';
import './dropdownBtn.css';

const Month_Dropdown = ({ options, buttonText, onSelect, selectedMonth1 , selectedMonth2, selected }) => {

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

        let monthFormat = {
            'Apr': 1, 
            'May': 2,
            'Jun': 3,
            'Jul': 4,
            'Aug': 5,
            'Sep': 6,
            'Oct': 7,
            'Nov': 8,
            'Dec': 9,
            'Jan': 10,
            'Feb': 11,
            'Mar': 12,
          }

          let month1 = monthFormat?.[selectedMonth1?.value]
          let month2 = monthFormat?.[option]

          if (selected == 1) {
            month1 = monthFormat?.[option]
            month2 = monthFormat?.[selectedMonth2?.value]
          } 
      
        //   console.log(selectedMonth1.value, selectedValue, month1, month2, '*** test ****');
      
          console.log(selectedMonth2, '-- selectedMonth2 --');
          // Check if the selected fromMonth index is after the toMonth index
          if (month1 > month2) {
            alert('From Month cannot be greater than To Month!');
            return
          } 
          else {
            setSelectedOption(option === selectedOption ? null : option);
            // setSelectedMonth2({ index: selectedIndex, value: selectedValue});
          }
    

    //   setSelectedOption(option === selectedOption ? null : option);
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
  
export default Month_Dropdown;
