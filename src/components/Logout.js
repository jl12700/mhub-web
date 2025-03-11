import { useNavigate } from 'react-router-dom';
import '../styles/Logout.css'; 

const Logout = ({ setShowModal }) => {
    const navigate = useNavigate();

    const confirmLogout = () => {
        setShowModal(false);
        navigate('/login'); 
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Are you sure you want to logout?</h2>
                <div className="modal-buttons">
                    <button onClick={confirmLogout} className="modal-button">Yes</button>
                    <button onClick={() => setShowModal(false)} className="modal-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Logout;
