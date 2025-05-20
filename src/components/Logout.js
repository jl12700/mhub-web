import { useNavigate } from 'react-router-dom';
import '../styles/Logout.css';

const Logout = ({ onClose }) => {  // Changed from setShowModal to more generic onClose
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear any authentication tokens or user data
      localStorage.removeItem('user');
      localStorage.removeItem('tempUser');
      
      // Close the modal
      if (typeof onClose === 'function') {
        onClose();
      }
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error (optional)
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Are you sure you want to logout?</h2>
        <div className="modal-buttons">
          <button 
            onClick={handleLogout} 
            className="modal-button confirm"
          >
            Yes, Logout
          </button>
          <button 
            onClick={onClose}  // Changed from setShowModal(false) to onClose
            className="modal-button cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;