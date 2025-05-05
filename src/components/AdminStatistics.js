import React ,  { useState, useEffect }from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminStatistics.css';
import Logout from './Logout'; // Import Logout component

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStatistics = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  // Example data for the chart
  const data = {
    labels: ['TV', 'Laptop', 'Extension Cord', 'Speakers', 'Microphone', 'Projector'],
    datasets: [
      {
        label: 'Usage Count',
        data: [12, 19, 3, 5, 2, 3], // Replace with actual data
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
              className={item === 'Statistics' ? 'active' : ''}
              onClick={() => {
                if (item === 'Reservations') navigate('/admin/reservations');
                if (item === 'Inventory') navigate('/admin/inventory');
                if (item === 'Logout') setShowLogoutModal(true); // Show logout modal
              }}
            >
              {item}
              {item === 'Statistics' && <span className="arrow">▶</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h1>Equipment Usage Statistics</h1>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>

        {/* Logout Modal */}
        {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
      </div>
    </div>
  );
};

export default AdminStatistics;