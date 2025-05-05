import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminReservations.css';
import { FaTrash } from 'react-icons/fa';
import Logout from './Logout';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reservations');
        const data = await response.json();
        const formattedReservations = data.map((res) => ({
          ...res,
          equipment: res.equipment || [],
          status: res.status || 'Pending',
        }));
        setReservations(formattedReservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  // Change dropdown only - update selectedReservation locally
  const handleStatusChange = (newStatus) => {
    setSelectedReservation((prev) => ({ ...prev, status: newStatus }));
  };

  // Save status to server
  const handleSaveStatus = async () => {
    try {
      await fetch(`http://localhost:5000/api/reservations/${selectedReservation._id || selectedReservation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedReservation.status }),
      });

      // Update local reservations list after saving
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          (res._id || res.id) === (selectedReservation._id || selectedReservation.id)
            ? { ...res, status: selectedReservation.status }
            : res
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const handleRemoveReservation = (id) => {
    const updatedReservations = reservations.filter((res) => (res._id || res.id) !== id);
    setReservations(updatedReservations);
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
                if (item === 'Reservations') navigate('/admin/reservations');
                if (item === 'Inventory') navigate('/admin/inventory');
                if (item === 'Statistics') navigate('/admin/statistics');
                if (item === 'Logout') setShowLogoutModal(true);
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
              <tr key={res._id || res.id}>
                <td>{res.id || res._id}</td>
                <td>{res.name}</td>
                <td>{res.mobile}</td>
                <td>{(res.equipment || []).join(', ')}</td>
                <td>{res.venue}</td>
                <td>{res.activity}</td>
                <td>
                  <div
                    className="status-bar"
                    style={{
                      backgroundColor: getStatusColor(res.status),
                      padding: '5px 10px',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
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
                    onClick={() => handleRemoveReservation(res._id || res.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Status Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Change Status</h2>
              <select
                value={selectedReservation.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Returned">Returned</option>
                <option value="Declined">Declined</option>
                <option value="Damaged">Damaged</option>
              </select>
              <div style={{ marginTop: '15px' }}>
                <button onClick={handleSaveStatus} style={{ marginRight: '10px' }}>
                  Save
                </button>
                <button onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
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
