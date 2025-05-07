import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faCheck, 
  faTimes, 
  faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminReservations.css';

const AdminReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch reservations from Supabase
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      // In a real application, this would be a Supabase query
      // const { data, error } = await supabase
      //   .from('reservations')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      
      // For demo purposes, we'll use localStorage
      const storedReservations = JSON.parse(localStorage.getItem('pendingReservations')) || [];
      
      // Add ID, user details, and default status if not present
      const processedReservations = storedReservations.map(reservation => {
        if (!reservation.id) {
          // In a real app, you'd get this from user authentication
          const userName = localStorage.getItem('userName') || 'john@dlsl.edu.ph'; 
          return {
            ...reservation,
            id: generateReservationId(),
            userName: userName,
            status: 'Pending'
          };
        }
        return reservation;
      });
      
      setReservations(processedReservations);
      
      // Save the processed reservations back to localStorage
      localStorage.setItem('pendingReservations', JSON.stringify(processedReservations));
    } catch (err) {
      alert('Failed to load reservations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique ID for each reservation
  const generateReservationId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle approving a reservation
  const handleApprove = async (id) => {
    try {
      setLoading(true);
      // In a real app, this would update Supabase
      // const { error } = await supabase
      //   .from('reservations')
      //   .update({ status: 'Accepted' })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // For demo purposes, update the local state
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === id ? { ...reservation, status: 'Accepted' } : reservation
        )
      );
      
      // Update localStorage
      updateLocalStorage('Accepted', id);
      alert('Reservation approved successfully!');
    } catch (err) {
      alert('Failed to approve reservation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle rejecting a reservation
  const handleReject = async (id) => {
    try {
      setLoading(true);
      // In a real app, this would update Supabase
      // For demo purposes, update the local state
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === id ? { ...reservation, status: 'Declined' } : reservation
        )
      );
      
      // Update localStorage
      updateLocalStorage('Declined', id);
      alert('Reservation declined successfully!');
    } catch (err) {
      alert('Failed to decline reservation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open status edit modal
  const openStatusModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowStatusModal(true);
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (selectedReservation) {
      try {
        setLoading(true);
        // In a real app, this would update Supabase
        
        // For demo purposes, update the local state
        setReservations(prevReservations => 
          prevReservations.map(reservation => 
            reservation.id === selectedReservation.id ? { ...reservation, status: newStatus } : reservation
          )
        );
        
        // Update localStorage
        updateLocalStorage(newStatus, selectedReservation.id);
        setShowStatusModal(false);
        alert('Status updated successfully!');
      } catch (err) {
        alert('Failed to update status: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Update localStorage with new status
  const updateLocalStorage = (newStatus, id) => {
    const updatedReservations = reservations.map(reservation => 
      reservation.id === id ? { ...reservation, status: newStatus } : reservation
    );
    localStorage.setItem('pendingReservations', JSON.stringify(updatedReservations));
  };

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(reservation => 
    reservation.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.usageLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display text for items
  const getEquipmentText = (items) => {
    if (!items || items.length === 0) return 'No items';
    return items.map(item => `${item.name} (${item.quantity})`).join(', ');
  };

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'green';
      case 'Declined': return 'red';
      case 'Returned': return 'blue';
      case 'Damaged': return 'orange';
      default: return 'gray';
    }
  };

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
          </div>
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
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="equipment-row">
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

      {/* Status Edit Modal */}
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