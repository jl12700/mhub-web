import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BorrowDetails.css';
import Logout from './Logout'; // Import Logout component

const BorrowDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [activity, setActivity] = useState('');
  const [usageLocation, setUsageLocation] = useState('');
  const [minDate, setMinDate] = useState('');
  const [modalError, setModalError] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      alert('No items selected. Redirecting to Borrow Item page.');
      navigate('/borrow');
    }
  }, [selectedItems, navigate]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today.toISOString().split('T')[0]);
  }, []);

  const validateForm = () => {
    let errorMessage = '';

    if (!pickupDate) {
      errorMessage = 'Pickup date is required.';
    } else if (pickupDate < minDate) {
      errorMessage = 'You cannot select a past date.';
    }

    if (!pickupTime) {
      errorMessage = 'Pickup time is required.';
    } else if (pickupDate === minDate) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (pickupTime < currentTime) {
        errorMessage = 'Pickup time must be later than the current time.';
      }
    }

    if (!returnTime) {
      errorMessage = 'Return time is required.';
    } else if (pickupTime && returnTime <= pickupTime) {
      errorMessage = 'Return time must be later than pickup time.';
    }

    if (errorMessage) {
      setModalError(errorMessage);
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      const newReservation = {
        items: selectedItems,
        pickupDate,
        pickupTime,
        activity,
        usageLocation,
      };

      const storedReservations = JSON.parse(localStorage.getItem('pendingReservations')) || [];
      const updatedReservations = [...storedReservations, newReservation];

      localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));

      alert('Reservation confirmed!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li className="active">Borrow Item</li>
          <li onClick={() => navigate('/profile')}>User Profile</li>
          <li onClick={() => setShowLogoutModal(true)}>Logout</li> {/* Show logout modal */}
        </ul>
      </div>

      <div className="main-content">
        <button className="back-button" onClick={() => navigate('/borrow')}>
          Back
        </button>
        <h1>Confirm Your Reservation</h1>
        <p>Review your selected items and provide the necessary details.</p>

        {modalError && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{modalError}</p>
              <button onClick={() => setModalError('')}>Close</button>
            </div>
          </div>
        )}

        <div className="details-layout">
          <div className="selected-items">
            <h3>Selected Equipment:</h3>
            <ul>
              {selectedItems.map((item, index) => (
                <li key={index}>
                  {item.name} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>

          <div className="reservation-form">
            <label>Pickup Date:</label>
            <input type="date" min={minDate} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />

            <label>Activity Purpose:</label>
            <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="e.g., School Presentation" />

            <label>Usage Location:</label>
            <input type="text" value={usageLocation} onChange={(e) => setUsageLocation(e.target.value)} placeholder="e.g., Room 203" />

            <div className="time-fields">
              <div>
                <label>Pickup Time:</label>
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </div>
              <div>
                <label>Return Time:</label>
                <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default BorrowDetails;