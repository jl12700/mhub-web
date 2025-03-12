import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminReservations.css';
import { FaTrash } from 'react-icons/fa'; // For the remove icon
import Logout from './Logout'; // Import Logout component

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch reservations from localStorage
    const storedReservations = JSON.parse(localStorage.getItem('pendingReservations')) || [];
    // Ensure `equipment` is always an array
    const formattedReservations = storedReservations.map((res) => ({
      ...res,
      equipment: res.equipment || [], // Default to empty array if undefined
    }));
    setReservations(formattedReservations);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updatedReservations = reservations.map((res) =>
      res.id === id ? { ...res, status: newStatus } : res
    );
    setReservations(updatedReservations);
    localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));
    setShowModal(false);
  };

  const handleRemoveReservation = (id) => {
    const updatedReservations = reservations.filter((res) => res.id !== id);
    setReservations(updatedReservations);
    localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Returned':
        return 'green';
      case 'Pending':
        return 'yellow';
      case 'Declined':
      case 'Damaged':
        return 'lightcoral';
      default:
        return 'gray';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
          {['Reservations', 'Inventory', 'Statistics', 'Logout'].map((item) => (
            <li
              key={item}
              className={item === 'Reservations' ? 'active' : ''}
              onClick={() => {
                if (item === 'Inventory') navigate('/admin/inventory');
                if (item === 'Statistics') navigate('/admin/statistics');
                if (item === 'Logout') setShowLogoutModal(true); // Show logout modal
              }}
            >
              {item}
              {item === 'Reservations' && <span className="arrow">▶</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h1>Reservation Requests</h1>
        <table>
          <thead>
            <tr>
              <th>ID Number</th>
              <th>Name</th>
              <th>Mobile No.</th>
              <th>Equipment</th>
              <th>Venue</th>
              <th>Activity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.name}</td>
                <td>{res.mobile}</td>
                <td>{res.equipment.join(', ')}</td>
                <td>{res.venue}</td>
                <td>{res.activity}</td>
                <td>
                  <div
                    className="status-bar"
                    style={{ backgroundColor: getStatusColor(res.status) }}
                  >
                    {res.status}
                  </div>
                </td>
                <td>
                  <button onClick={() => { setSelectedReservation(res); setShowModal(true); }}>
                    Edit Status
                  </button>
                  <FaTrash
                    className="remove-icon"
                    onClick={() => handleRemoveReservation(res.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Change Status</h2>
              <select
                value={selectedReservation.status}
                onChange={(e) => handleStatusChange(selectedReservation.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Returned">Returned</option>
                <option value="Declined">Declined</option>
                <option value="Damaged">Damaged</option>
              </select>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
      </div>
    </div>
  );
};

export default AdminReservations;