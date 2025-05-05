import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userType, setUserType] = useState('');
  const [reservationHistory, setReservationHistory] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [outOfStockEquipment, setOutOfStockEquipment] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const fetchUserAndReservations = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserType(user.userType);

        try {
          // Fetch all reservations
          const res = await axios.get('http://localhost:5000/api/reservations');

          if (user.userType === 'admin') {
            // Admin sees pending approvals
            const pending = res.data.filter(r => r.status === 'pending');
            setPendingApprovals(pending);
          } else {
            // Regular user sees their own reservations
            const userRes = res.data.filter(r => r.userId === user.id);
            setReservationHistory(userRes);
            setUserReservations(userRes.filter(r => r.status === 'approved'));
          }
        } catch (error) {
          console.error('Failed to fetch reservations:', error);
        }

        // Fetch out-of-stock equipment
        try {
          const equipRes = await axios.get('http://localhost:5000/api/equipment');
          const outOfStock = equipRes.data.filter(eq => eq.quantity === 0).map(eq => eq.name);
          setOutOfStockEquipment(outOfStock);
        } catch (error) {
          console.error('Failed to fetch equipment:', error);
        }
      }
    };

    fetchUserAndReservations();
  }, []);

  const handleNavigation = (item) => {
    setActiveItem(item);
    if (item === 'Borrow Item') navigate('/borrow');
    if (item === 'User Profile') navigate('/profile');
    if (item === 'Logout') setShowLogoutModal(true);
    if (item === 'Reservations') navigate('/admin/reservations');
    if (item === 'Inventory') navigate('/admin/inventory');
    if (item === 'Statistics') navigate('/admin/statistics');
  };

  const adminSidebarItems = ['Reservations', 'Inventory', 'Statistics', 'Logout'];
  const userSidebarItems = ['Dashboard', 'Borrow Item', 'User Profile', 'Logout'];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
          {(userType === 'admin' ? adminSidebarItems : userSidebarItems).map((item) => (
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
        {userType === 'admin' ? (
          <div className="admin-welcome">
            <h1>Welcome, Admin!</h1>
            <p>Please use the sidebar to manage reservations, inventory, and view statistics.</p>
          </div>
        ) : (
          <div className="tiles-container">
            <div className="tile">
              <div className="tile-header">Reservation History</div>
              <div className="tile-content">
                {reservationHistory.length > 0 ? (
                  <ul>
                    {reservationHistory.map((res) => (
                      <li key={res._id}>
                        {res.items.map((item, idx) => (
                          <div key={idx}>{item.name} (Qty: {item.quantity})</div>
                        ))}
                        Pickup: {res.pickupDate}
                      </li>
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
                      <li key={res._id}>
                        {res.items.map((item, idx) => (
                          <div key={idx}>{item.name} (Qty: {item.quantity})</div>
                        ))}
                        Pickup: {res.pickupDate}
                      </li>
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
                    {pendingApprovals.map((res) => (
                      <li key={res._id}>
                        {res.items.map((item, idx) => (
                          <div key={idx}>{item.name} (Qty: {item.quantity})</div>
                        ))}
                        Pickup: {res.pickupDate}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No pending approvals.'
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default Dashboard;
