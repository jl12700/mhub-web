import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faPencilAlt, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdminInventory.css';

const AdminInventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    stocks: 0
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch equipment from Supabase on mount
  useEffect(() => {
    getEquips();
  }, []);

  const getEquips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('name')
        .limit(1000); // Explicitly set a high limit to ensure all items are fetched

      if (error) throw error;
      if (data) setEquipmentList(data);
    } catch (err) {
      alert('Failed to load equipment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    if (!newEquipment.name.trim()) {
      alert('Equipment name is required');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .insert([{
          name: newEquipment.name.trim(),
          stocks: parseInt(newEquipment.stocks)
        }])
        .select();

      if (error) throw error;
      
      setEquipmentList([...equipmentList, data[0]]);
      setNewEquipment({ name: '', stocks: 0 });
      setShowAddModal(false);
      alert('Equipment added successfully!');
    } catch (err) {
      alert('Failed to add equipment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment({...equipment});
    setShowEditModal(true);
  };

  const handleUpdateEquipment = async () => {
    if (!editingEquipment.name.trim()) {
      alert('Equipment name is required');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .update({
          name: editingEquipment.name.trim(),
          stocks: parseInt(editingEquipment.stocks)
        })
        .eq('id', editingEquipment.id)
        .select();

      if (error) throw error;
      
      setEquipmentList(equipmentList.map(item => 
        item.id === editingEquipment.id ? data[0] : item
      ));
      setShowEditModal(false);
      alert('Equipment updated successfully!');
    } catch (err) {
      alert('Failed to update equipment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEquipmentList(equipmentList.filter(item => item.id !== id));
      alert('Equipment deleted successfully!');
    } catch (err) {
      alert('Failed to delete equipment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipmentList.filter((equipment) =>
    equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/mhublogo.png" alt="DLSL Logo" className="logo" />
        <ul>
          {['Reservations', 'Inventory', 'Statistics', 'Logout'].map((item) => (
            <li
              key={item}
              className={item === 'Inventory' ? 'active' : ''}
              onClick={() => {
                if (item === 'Reservations') navigate('/admin/reservations');
                if (item === 'Inventory') navigate('/admin/inventory');
                if (item === 'Statistics') navigate('/admin/statistics');
                if (item === 'Logout') setShowLogoutModal(true); // Show logout modal
              }}
            >
              {item}
              {item === 'Inventory' && <span className="arrow">▶</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h1 className="no-underline">Equipment Inventory Management</h1>
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>

        <div className="admin-controls">
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add New Equipment
          </button>
        </div>

        <div className="Sequipment-table-container">
          {loading && <div className="loading">Loading...</div>}
          
          <table className="Sequipment-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th className="text-center">Available Stock</th>
                <th className="action-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((equipment) => (
                  <tr key={equipment.id} className="Sequipment-row">
                    <td>{equipment.name}</td>
                    <td className="text-center">{equipment.stocks}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditEquipment(equipment)}
                          aria-label="Edit equipment"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEquipment(equipment.id)}
                          aria-label="Delete equipment"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-results">
                    {loading ? 'Loading...' : 'No equipment found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal equipment-modal">
            <h2>Add New Equipment</h2>
            <div className="form-group">
              <label>Equipment Name:</label>
              <input
                type="text"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                placeholder="Enter equipment name"
              />
            </div>

            <div className="form-group">
              <label>Available Stock:</label>
              <input
                type="number"
                min="0"
                value={newEquipment.stocks}
                onChange={(e) => setNewEquipment({...newEquipment, stocks: e.target.value})}
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button className="save-btn" onClick={handleAddEquipment}>
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditModal && editingEquipment && (
        <div className="modal-overlay">
          <div className="modal equipment-modal">
            <h2>Edit Equipment</h2>
            <div className="form-group">
              <label>Equipment Name:</label>
              <input
                type="text"
                value={editingEquipment.name}
                onChange={(e) => setEditingEquipment({...editingEquipment, name: e.target.value})}
                placeholder="Enter equipment name"
              />
            </div>

            <div className="form-group">
              <label>Available Stock:</label>
              <input
                type="number"
                min="0"
                value={editingEquipment.stocks}
                onChange={(e) => setEditingEquipment({...editingEquipment, stocks: e.target.value})}
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button className="save-btn" onClick={handleUpdateEquipment}>
                <FontAwesomeIcon icon={faSave} /> Save Changes
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

export default AdminInventory;