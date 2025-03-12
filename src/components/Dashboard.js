import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout'; 
import UserProfile from './UserProfile';
import '../styles/Dashboard.css';
import '../styles/Logout.css'; 

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [reservationHistory, setReservationHistory] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [outOfStockEquipment, setOutOfStockEquipment] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const storedApprovals = JSON.parse(localStorage.getItem('pendingApprovals')) || [];
    setPendingApprovals(storedApprovals);
  }, []);

  const handleNavigation = (item) => {
    setActiveItem(item);
    if (item === 'Borrow Item') navigate('/borrow');
    if (item === 'User Profile') navigate('/profile');
    if (item === 'Logout') setShowLogoutModal(true); // Show logout modal
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
          {['Dashboard', 'Borrow Item', 'User Profile', 'Logout'].map((item) => (
            <li
              key={item}
              className={activeItem === item ? 'active' : ''}
              onClick={() => handleNavigation(item)}
            >
              {item}
              {activeItem === item && <span className="arrow">▶</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="tiles-container">
          <div className="tile">
            <div className="tile-header">Reservation History</div>
            <div className="tile-content">
              {reservationHistory.length > 0 ? (
                <ul>
                  {reservationHistory.map((res) => (
                    <li key={res.id}>{res.item} - {res.date}</li>
                  ))}
                </ul>
              ) : (
                'No recent reservations.'
              )}
            </div>
          </div>

          <div className="tile">
            <div className="tile-header">User Reservations</div>
            <div className="tile-content">
              {userReservations.length > 0 ? (
                <ul>
                  {userReservations.map((res) => (
                    <li key={res.id}>{res.item} - {res.date}</li>
                  ))}
                </ul>
              ) : (
                'No active reservations.'
              )}
            </div>
          </div>

          <div className="tile">
            <div className="tile-header">Out of Stock Equipment</div>
            <div className="tile-content">
              {outOfStockEquipment.length > 0 ? (
                outOfStockEquipment.join(', ')
              ) : (
                'All equipment is available.'
              )}
            </div>
          </div>

          <div className="tile">
            <div className="tile-header">Pending Approvals</div>
            <div className="tile-content">
              {pendingApprovals.length > 0 ? (
                <ul>
                  {pendingApprovals.map((res, index) => (
                    <li key={index}>{res.item} - Pickup: {res.pickupDate}</li>
                  ))}
                </ul>
              ) : (
                'No pending approvals.'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default Dashboard;
