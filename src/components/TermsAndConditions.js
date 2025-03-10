import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TermsAndConditions.css';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false); 

  const handleAccept = () => {
    if (isChecked) {
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="terms-container">
      <h2>Terms and Conditions</h2>
      <div className="terms-content">
        <p>1. Guidelines on Returning:</p>
        <ul>
          <li>Users are required to return the equipment within the day.</li>
          <li>If a user exceeds the return time, they can return the equipment at the guard desk at Diokno Building.</li>
        </ul>
        <p>2. Guideline for Damaged Equipment:</p>
        <ul>
          <li>Students must replace damaged equipment with the same brand.</li>
          <li>MHUB will not accept money as payment for the replacement of damaged equipment.</li>
        </ul>
        <p>3. Guidelines for Borrowing:</p>
        <ul>
          <li>Upon filling a reservation, users must present their ID for verification for claiming the items.</li>
          <li>MHUB will not lend items to users who do not have their ID.</li>
          <li>MHUB will not lend items if the ID does not belong to them.</li>
          <li>Students are not allowed to bring home the borrowed equipment.</li>
        </ul>
      </div>

      <div className="checkbox-container">
        <input
          type="checkbox"
          id="terms-checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label htmlFor="terms-checkbox">I have read and agree to the Terms and Conditions</label>
      </div>

      <div className="button-container">
        <button onClick={handleAccept} disabled={!isChecked}>Accept Terms</button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
