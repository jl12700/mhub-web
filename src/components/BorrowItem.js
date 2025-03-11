import React, { useState } from 'react';
import '../styles/BorrowItem.css';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout'; // Import Logout component


const BorrowItem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  const equipmentList = [
    { id: 1, name: 'TV', stock: 5, image: '/tv.jpg' },
    { id: 2, name: 'Laptop', stock: 10, image: '/laptop.jpg' },
    { id: 3, name: 'Extension Cord', stock: 8, image: '/extension.jpg' },
    { id: 4, name: 'Speakers', stock: 3, image: '/speaker.jpg' },
    { id: 5, name: 'Microphone', stock: 7, image: '/mic.jpg' },
    { id: 6, name: 'Projector', stock: 2, image: '/projector.jpg' },
  ];

  const filteredEquipment = equipmentList.filter((equipment) =>
    equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectionChange = (id, quantity) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleNext = () => {
    const selected = Object.entries(selectedItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => ({
        ...equipmentList.find((item) => item.id === parseInt(id)),
        quantity: qty,
      }));

    if (selected.length > 0) {
      navigate('/borrow-details', { state: { selectedItems: selected } });
    } else {
      alert('Please select at least one item.');
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
        <div className="header">
          <h1>Borrow Equipment</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="equipment-grid-container">
          <div className="equipment-grid">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((equipment) => (
                <div key={equipment.id} className="equipment-card">
                  <img src={equipment.image} alt={equipment.name} className="equipment-image" />
                  <h3>{equipment.name}</h3>
                  <p>Stock: {equipment.stock}</p>
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => handleSelectionChange(equipment.id, (selectedItems[equipment.id] || 0) - 1)}
                      disabled={(selectedItems[equipment.id] || 0) <= 0}
                    >
                      -
                    </button>
                    <span className="quantity">{selectedItems[equipment.id] || 0}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleSelectionChange(equipment.id, (selectedItems[equipment.id] || 0) + 1)}
                      disabled={(selectedItems[equipment.id] || 0) >= equipment.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No equipment found.</p>
            )}
          </div>
        </div>

        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default BorrowItem;