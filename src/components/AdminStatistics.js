import React, { useState, useEffect } from 'react';
import '../styles/AdminStatistics.css';
import {   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart,Pie,Cell} from 'recharts';
import { RefreshCw } from 'lucide-react';

const AdminStatistics = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [reportType, setReportType] = useState('equipment');
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff6b81', '#36a2eb'];

  useEffect(() => {
    fetchEquipmentUsageData();
  }, [timeframe]);

  const fetchEquipmentUsageData = () => {
    setLoading(true);

    setTimeout(() => {
      const reservations = JSON.parse(localStorage.getItem('pendingReservations')) || [];
      const equipmentUsage = processReservationData(reservations);
      setEquipmentData(equipmentUsage);
      setLoading(false);
    }, 500);
  };

  const processReservationData = (reservations) => {
    const equipmentCounts = {};

    reservations.forEach(reservation => {
      if (reservation.status === 'Accepted' || reservation.status === 'Returned') {
        const items = reservation.items || [];

        items.forEach(item => {
          const itemName = item.name;
          const quantity = parseInt(item.quantity) || 1;

          if (!equipmentCounts[itemName]) {
            equipmentCounts[itemName] = 0;
          }

          equipmentCounts[itemName] += quantity;
        });
      }
    });

    const equipmentArray = Object.keys(equipmentCounts).map(name => ({
      name,
      count: equipmentCounts[name]
    }));

    return equipmentArray.sort((a, b) => b.count - a.count);
  };

  const renderBarChart = () => {
    if (equipmentData.length === 0) {
      return <div className="no-data">No equipment usage data available</div>;
    }

    const topEquipment = equipmentData.slice(0, 10);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topEquipment}
          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis label={{ value: 'Usage Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Times Used" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    if (equipmentData.length === 0) {
      return <div className="no-data">No equipment usage data available</div>;
    }

    const topEquipment = equipmentData.slice(0, 8);

    let pieData = [...topEquipment];
    if (equipmentData.length > 8) {
      const othersCount = equipmentData.slice(8).reduce((sum, item) => sum + item.count, 0);
      if (othersCount > 0) {
        pieData.push({ name: 'Others', count: othersCount });
      }
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey="count"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} units`, 'Usage']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const exportData = () => {
    const csvData = [
      ['Equipment Name', 'Usage Count'],
      ...equipmentData.map(item => [item.name, item.count])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `equipment_usage_${timeframe}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/mhublogo.png" alt="DLSL Logo" className="logo" />
        <ul>
          <li onClick={() => window.location.href = '/admin/reservations'}>Reservations</li>
          <li onClick={() => window.location.href = '/admin/inventory'}>Inventory</li>
          <li className="active">Statistics<span className="arrow">▶</span></li>
          <li onClick={() => window.location.href = '/logout'}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Equipment Usage Statistics</h1>
        <div className="report-controls">
          <div className="control-group">
            <label>Time Period:</label>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="select-control"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button 
            className="refresh-btn"
            onClick={fetchEquipmentUsageData}
          >
            <RefreshCw size={16} />
          </button>

          <button 
            className="export-btn"
            onClick={exportData}
          >
            Export Report
          </button>
        </div>

        <div className="admin-statistics-container">
          <h2>Most Used Equipment ({timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})</h2>
          {loading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <>
              <div className="chart-container">
                <div className="chart-tabs">
                  <button 
                    className={reportType === 'equipment' ? 'active-tab' : ''}
                    onClick={() => setReportType('equipment')}
                  >
                    Equipment Usage
                  </button>
                </div>
                <div className="chart-content">
                  {renderBarChart()}
                </div>
              </div>

              <div className="equipment-table-container">
                <h3>Equipment Usage Details</h3>
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Equipment Name</th>
                      <th>Times Used</th>
                      <th>Usage %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentData.length > 0 ? (
                      equipmentData.slice(0, 15).map((item, index) => {
                        const totalUsage = equipmentData.reduce((sum, equip) => sum + equip.count, 0);
                        const percentage = ((item.count / totalUsage) * 100).toFixed(1);

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.count}</td>
                            <td>{percentage}%</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-results">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
