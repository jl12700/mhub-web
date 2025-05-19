import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheck, faTimes, faEdit,faSave,faFilter,faSync} from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminReservations.css';

const AdminReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      const storedReservations = JSON.parse(localStorage.getItem('pendingReservations')) || [];
      
      const processedReservations = storedReservations.map(reservation => {
        if (!reservation.id) {
          
          const userName = reservation.userName || localStorage.getItem('userName') || 'student@dlsl.edu.ph'; 
          return {
            ...reservation,
            id: generateReservationId(),
            userName: userName,
            status: reservation.status || 'Pending',
            created_at: reservation.created_at || new Date().toISOString()
          };
        }
        return reservation;
      });
      
      setReservations(processedReservations);
      
      localStorage.setItem('pendingReservations', JSON.stringify(processedReservations));
    } catch (err) {
      alert('Failed to load reservations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  const generateReservationId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      
      const updatedReservations = reservations.map(reservation => 
        reservation.id === id ? { ...reservation, status: 'Accepted' } : reservation
      );
      
      setReservations(updatedReservations);
      
     
      localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));
      
     
      window.dispatchEvent(new Event('reservationUpdated'));
      
      alert('Reservation approved successfully!');
    } catch (err) {
      alert('Failed to approve reservation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      
      const updatedReservations = reservations.map(reservation => 
        reservation.id === id ? { ...reservation, status: 'Declined' } : reservation
      );
      
      setReservations(updatedReservations);
      
      localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));
 
      window.dispatchEvent(new Event('reservationUpdated'));
      
      alert('Reservation declined successfully!');
    } catch (err) {
      alert('Failed to decline reservation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowStatusModal(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedReservation) {
      try {
        setLoading(true);
      
        const updatedReservations = reservations.map(reservation => 
          reservation.id === selectedReservation.id ? { ...reservation, status: newStatus } : reservation
        );
        
        setReservations(updatedReservations);
        
        
        localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));
    
        window.dispatchEvent(new Event('reservationUpdated'));
        
        setShowStatusModal(false);
        alert('Status updated successfully!');
      } catch (err) {
        alert('Failed to update status: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.usageLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || reservation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getEquipmentText = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map(item => `${item.name} (${item.quantity})`).join(', ');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'green';
      case 'Declined': return 'red';
      case 'Returned': return 'blue';
      case 'Damaged': return 'orange';
      default: return 'gray';
    }
  };

  const prioritizedReservations = [...filteredReservations].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/mhublogo.png" alt="DLSL Logo" className="logo" />
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
        <div className="header">
          <h1 className="no-underline">Reservation Management</h1>
          <div className="search-container">
  <input 
    type="text" 
    className="search-bar"
    placeholder="Search by ID or Name" 
    value={searchTerm} 
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <FontAwesomeIcon icon={faSearch} className="search-icon" />
  
  <button 
    className="filter-btn"
    onClick={() => setShowFilters(!showFilters)}
    title="Filter"
  >
    <FontAwesomeIcon icon={faFilter} />
  </button>
  
  <button 
    className="refresh-btn"
    onClick={fetchReservations}
    title="Refresh data"
  >
    <FontAwesomeIcon icon={faSync} />
  </button>
</div>
        </div>
        
        {showFilters && (
          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Returned">Returned</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
          </div>
        )}

        <div className="pending-count">
          <span>{reservations.filter(r => r.status === 'Pending').length} pending requests</span>
        </div>

        <div className="equipment-table-container">
          {loading && <div className="loading">Loading...</div>}
          
          <table className="equipment-table">
            <thead>
              <tr>
                <th>ID Number</th>
                <th>Email</th>
                <th>Equipment</th>
                <th>Venue</th>
                <th>Activity</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prioritizedReservations.length > 0 ? (
                prioritizedReservations.map((reservation) => (
                  <tr key={reservation.id} className={`equipment-row ${reservation.status === 'Pending' ? 'pending-row' : ''}`}>
                    <td>{reservation.id}</td>
                    <td>{reservation.userName}</td>
                    <td>{getEquipmentText(reservation.items)}</td>
                    <td>{reservation.usageLocation}</td>
                    <td>{reservation.activity}</td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(reservation.status) }}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {reservation.status === 'Pending' && (
                          <>
                            <button 
                              className="approve-btn" 
                              onClick={() => handleApprove(reservation.id)}
                              title="Approve"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button 
                              className="reject-btn" 
                              onClick={() => handleReject(reservation.id)}
                              title="Reject"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </>
                        )}
                        <button 
                          className="edit-btn" 
                          onClick={() => openStatusModal(reservation)}
                          title="Edit Status"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    {loading ? 'Loading...' : 'No reservations found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showStatusModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal reservation-modal">
            <h2>Update Reservation Status</h2>
            <div className="form-group">
              <label>Reservation ID:</label>
              <span className="modal-info">{selectedReservation?.id}</span>
            </div>
            <div className="form-group">
              <label>User:</label>
              <span className="modal-info">{selectedReservation?.userName}</span>
            </div>
            <div className="form-group">
              <label>Equipment:</label>
              <span className="modal-info">{getEquipmentText(selectedReservation?.items)}</span>
            </div>
            <div className="form-group">
              <label>Current Status:</label>
              <span 
                className="status-badge modal-status" 
                style={{ backgroundColor: getStatusColor(selectedReservation?.status) }}
              >
                {selectedReservation?.status}
              </span>
            </div>
            <div className="status-options">
              <button 
                onClick={() => handleStatusChange('Pending')}
                className={selectedReservation?.status === 'Pending' ? 'active' : ''}
              >
                Pending
              </button>
              <button 
                onClick={() => handleStatusChange('Accepted')}
                className={selectedReservation?.status === 'Accepted' ? 'active' : ''}
              >
                Accepted
              </button>
              <button 
                onClick={() => handleStatusChange('Returned')}
                className={selectedReservation?.status === 'Returned' ? 'active' : ''}
              >
                Returned
              </button>
              <button 
                onClick={() => handleStatusChange('Declined')}
                className={selectedReservation?.status === 'Declined' ? 'active' : ''}
              >
                Declined
              </button>
              <button 
                onClick={() => handleStatusChange('Damaged')}
                className={selectedReservation?.status === 'Damaged' ? 'active' : ''}
              >
                Damaged
              </button>
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowStatusModal(false)}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button className="save-btn" onClick={() => setShowStatusModal(false)}>
                <FontAwesomeIcon icon={faSave} /> Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default AdminReservations;