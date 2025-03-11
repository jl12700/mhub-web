import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css'; // Import the updated CSS file

const UserProfile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [userType, setUserType] = useState('student');
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [isEditing, setIsEditing] = useState(false);

  // Load user details from localStorage or state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setEmail(user.email || '');
    setIdNumber(user.idNumber || '');
    setUserType(user.userType || 'student');
    setPhoneNumber(user.phoneNumber || ''); // Load phone number
  }, []);

  const handleSave = () => {
    // Save updated user details to localStorage
    const updatedUser = { email, idNumber, userType, phoneNumber }; // Include phone number
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/dlsl-logo.png" alt="DLSL Logo" className="logo" />
        <div className="sidebar-title">MHUB Reservation</div>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/borrow')}>Borrow Item</li>
          <li className="active">User Profile</li>
          <li onClick={() => navigate('/logout')}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <h1>User Profile</h1>
        <div className="profile-details">
          <div className="profile-fields-grid">
            {/* Email and User Type */}
            <div className="profile-field">
              <label>Email:</label>
              <span>{email}</span> {/* Read-only email */}
            </div>
            <div className="profile-field">
              <label>User Type:</label>
              <span>{userType}</span> {/* Read-only user type */}
            </div>

            {/* ID Number and Phone Number */}
            <div className="profile-field">
              <label>ID Number:</label>
              <span>{idNumber}</span> {/* Read-only ID number */}
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

          {/* Profile Actions */}
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;