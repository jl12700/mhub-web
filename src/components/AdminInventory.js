import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminInventory.css';
import Logout from './Logout'; // Import Logout component

const AdminInventory = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'TV', stock: 5 },
    { id: 2, name: 'Laptop', stock: 10 },
    { id: 3, name: 'Extension Cord', stock: 8 },
  ]);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  // Function to update stock
  const handleStockChange = (id, newStock) => {
    const updatedEquipment = equipment.map((item) =>
      item.id === id ? { ...item, stock: newStock } : item
    );
    setEquipment(updatedEquipment);
  };

  // Function to save stock to localStorage
  const handleSave = () => {
    localStorage.setItem('equipmentStock', JSON.stringify(equipment));
    alert('Stock saved successfully!');
  };

  // Render inventory items
  const renderInventoryItems = equipment.map((item) => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>
        <input
          type="number"
          value={item.stock}
          onChange={(e) => handleStockChange(item.id, parseInt(e.target.value))}
        />
      </td>
      <td className="btn-group">
        <button
          className="btn-increase"
          onClick={() => handleStockChange(item.id, item.stock + 1)}
        >
          +
        </button>
        <button
          className="btn-decrease"
          onClick={() => handleStockChange(item.id, item.stock - 1)}
        >
          −
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
          {['Reservations', 'Inventory', 'Statistics', 'Logout'].map((item) => (
            <li
              key={item}
              className={item === 'Inventory' ? 'active' : ''}
              onClick={() => {
                if (item === 'Reservations') navigate('/admin/reservations');
                if (item === 'Statistics') navigate('/admin/statistics');
                if (item === 'Logout') setShowLogoutModal(true); // Show logout modal
              }}
            >
              {item}
              {item === 'Inventory' && <span className="arrow">▶</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h1>Equipment Inventory</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderInventoryItems}</tbody>
        </table>
        <button className="btn-save" onClick={handleSave}>
          Save All
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default AdminInventory;