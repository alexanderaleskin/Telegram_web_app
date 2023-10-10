
import React, { useState } from 'react';
import './listItem.css'; // Import your CSS file
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import icons from a library

export function ListItem({ name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    // Handle the action here, e.g., perform an action or update state.
    console.log(`Performed action "${action}" on ${name}`);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={`list-item ${isOpen ? 'open' : ''}`}>
      <div className="header">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="checkbox"
        />
        <span className="name">{name}</span>
        <button className="toggle-details" onClick={toggleDetails}>
          {isOpen ? (
            <>
              -
              {/* <FontAwesomeIcon icon="minus" className="icon" /> */}
              Close Details
            </>
          ) : (
            <>
              +
              {/* <FontAwesomeIcon icon="plus" className="icon" /> */}
              Open Details
            </>
          )}
        </button>
      </div>
      {isOpen && (
        <div className="details">
          <select onChange={(e) => handleAction(e.target.value)} className="action-dropdown">
            <option value="">Choose an action</option>
            <option value="Action 1">Action 1</option>
            <option value="Action 2">Action 2</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ListItem;

