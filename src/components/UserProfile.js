import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout'; // Import Logout component
import '../styles/UserProfile.css'; 

const UserProfile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [userType, setUserType] = useState('student');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setEmail(user.email || '');
    setIdNumber(user.idNumber || '');
    setUserType(user.userType || 'student');
    setPhoneNumber(user.phoneNumber || '');
  }, []);

  const handleSave = () => {
    const updatedUser = { email, idNumber, userType, phoneNumber };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/mhublogo.png" alt="DLSL Logo" className="logo" />
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/borrow')}>Borrow Item</li>
          <li className="active">User Profile</li>
          <li onClick={() => setShowModal(true)}>Logout</li> {/* Open modal */}
        </ul>
      </div>

      <div className="main-content">
        <h1>User Profile</h1>
        <div className="profile-details">
          <div className="profile-fields-grid">
            <div className="profile-field">
              <label>Email:</label>
              <span>{email}</span>
            </div>
            <div className="profile-field">
              <label>User Type:</label>
              <span>{userType}</span>
            </div>
            <div className="profile-field">
              <label>ID Number:</label>
              <span>{idNumber}</span>
            </div>
            <div className="profile-field">
              <label>Phone Number:</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 09123456789"
                />
              ) : (
                <span>{phoneNumber || 'N/A'}</span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && <Logout setShowModal={setShowModal} />}
    </div>
  );
};

export default UserProfile;