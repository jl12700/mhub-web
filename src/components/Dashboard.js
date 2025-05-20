import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
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
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  useEffect(() => {
    const storedReservations = JSON.parse(localStorage.getItem('pendingReservations')) || [];
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserType(user.userType);
      
      const userEmail = user.email || localStorage.getItem('userName');
      
      const pending = storedReservations.filter(
        res => res.status === 'Pending' && res.userName === userEmail
      );
      
      const active = storedReservations.filter(
        res => res.status === 'Accepted' && res.userName === userEmail
      );
      
      const history = storedReservations.filter(
        res => (res.status === 'Returned' || res.status === 'Declined' || res.status === 'Damaged') 
        && res.userName === userEmail
      );
      
      setPendingApprovals(pending);
      setUserReservations(active);
      setReservationHistory(history);
    }
    
    setOutOfStockEquipment(['Printer']);
  }, [refreshKey]); 

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'pendingReservations') {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleNavigation = (item) => {
    setActiveItem(item);
    switch (item) {
      case 'Borrow Item':
        navigate('/borrow');
        break;
      case 'User Profile':
        navigate('/profile');
        break;
      case 'Logout':
        setShowLogoutModal(true);
        break;
      case 'Reservations':
        navigate('/admin/reservations');
        break;
      case 'Inventory':
        navigate('/admin/inventory');
        break;
      case 'Statistics':
        navigate('/admin/statistics');
        break;
      default:
        break;
    }
  };

  const adminSidebarItems = ['Reservations', 'Inventory', 'Statistics', 'Logout'];
  const userSidebarItems = ['Dashboard', 'Borrow Item', 'User Profile', 'Logout'];

  const formatReservationItem = (res) => {
    const itemNames = res.items ? res.items.map(item => `${item.name} (${item.quantity})`).join(', ') : 'No items';
    return `${itemNames} - Pickup: ${res.pickupDate}`;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/mhublogo.png" alt="DLSL Logo" className="logo" />
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
        <div className="header">
          <h1 className="no-underline">Dashboard Overview </h1>
          
        </div>

        {userType !== 'admin' && (
          <div className="tiles-container">
            <div className="tile">
              <div className="tile-header">Reservation History</div>
              <div className="tile-content">
                {reservationHistory.length > 0 ? (
                  <ul>
                    {reservationHistory.map((res, index) => (
                      <li key={index}>
                        {formatReservationItem(res)}
                        <span className="status-badge" style={{ 
                          backgroundColor: res.status === 'Returned' ? 'blue' : 
                                           res.status === 'Declined' ? 'red' : 
                                           res.status === 'Damaged' ? 'orange' : 'gray' 
                        }}>
                          {res.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No recent reservations.'
                )}
              </div>
            </div>

            <div className="tile">
              <div className="tile-header">Active Reservations</div>
              <div className="tile-content">
                {userReservations.length > 0 ? (
                  <ul>
                    {userReservations.map((res, index) => (
                      <li key={index}>
                        {formatReservationItem(res)}
                        <span className="status-badge" style={{ backgroundColor: 'green' }}>
                          {res.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No active reservations.'
                )}
              </div>
            </div>

            <div className="tile">
              <div className="tile-header">Out of Stock</div>
              <div className="tile-content">
                {outOfStockEquipment.length > 0
                  ? outOfStockEquipment.join(', ')
                  : 'All equipment is available.'}
              </div>
            </div>

            <div className="tile">
              <div className="tile-header">Pending Approvals</div>
              <div className="tile-content">
                {pendingApprovals.length > 0 ? (
                  <ul>
                    {pendingApprovals.map((res, index) => (
                      <li key={index}>
                        {formatReservationItem(res)}
                        <span className="status-badge" style={{ backgroundColor: 'gray' }}>
                          {res.status}
                        </span>
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
