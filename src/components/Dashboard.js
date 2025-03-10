import React, { useState } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  return (
    <div className="dashboard-container">
      
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
  <li className={activeItem === 'Dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}>Dashboard</li>
  <li className={activeItem === 'Borrow Item' ? 'active' : ''} onClick={() => navigate('/borrow')}>Borrow Item</li>
  <li className={activeItem === 'User Profile' ? 'active' : ''} onClick={() => navigate('/profile')}>User Profile</li>
  <li className={activeItem === 'Logout' ? 'active' : ''} onClick={() => navigate('/logout')}>Logout</li>
</ul>

      </div>

      <div className="main-content">
       
        <div className="header">
          <h1>Welcome to MHUB Dashboard</h1>
          <p>All equipment is ready for reservation.</p>
          <input
            type="text"
            className="search-bar"
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        
        <div className="equipment-grid">
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((equipment) => (
              <div key={equipment.id} className="equipment-card">
                <img src={equipment.image} alt={equipment.name} className="equipment-image" />
                <h3>{equipment.name}</h3>
                <p>Stock: {equipment.stock}</p>
              </div>
            ))
          ) : (
            <p className="no-results">No equipment found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
