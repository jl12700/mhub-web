import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSearch, faPlus, faMinus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/BorrowItem.css';

const BorrowItem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [equipmentList, setEquipmentList] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const navigate = useNavigate();

  // Fetch equipment from Supabase on mount
  useEffect(() => {
    getEquips();
  }, []);

  // Update selected count whenever selectedItems changes
  useEffect(() => {
    const count = Object.values(selectedItems).reduce((acc, qty) => acc + (qty > 0 ? 1 : 0), 0);
    setSelectedCount(count);
  }, [selectedItems]);

  const getEquips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) setEquipmentList(data);
    } catch (err) {
      alert('Failed to load equipment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipmentList.filter((equipment) =>
    equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectionChange = (id, quantity) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleNext = () => {
    const selected = Object.entries(selectedItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = equipmentList.find((item) => item.id === parseInt(id));
        return { ...item, quantity: qty };
      });

    if (selected.length > 0) {
      navigate('/borrow-details', { state: { selectedItems: selected } });
    } else {
      alert('Please select at least one item.');
    }
  };

  const handleClearSelections = () => {
    setSelectedItems({});
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/mhublogo.png" alt="DLSL Logo" className="logo" />
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li className="active">Borrow Item</li>
          <li onClick={() => navigate('/profile')}>User Profile</li>
          <li onClick={() => setShowLogoutModal(true)}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h1 className="no-underline">Borrow Item</h1>
            {selectedCount > 0 && (
              <div className="selection-badge">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          <div className="header-right">
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
            {selectedCount > 0 && (
              <button className="clear-button" onClick={handleClearSelections}>
                Clear All
              </button>
            )}
          </div>
        </div>


        <div className="Bequipment-table-container">
          {loading ? (
            <div className="loading-spinner">Loading equipment...</div>
          ) : (
            <table className="Bequipment-table">
              <thead>
                <tr>
                  <th>Equipment Name</th>
                  <th className="text-center">Available Stock</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((equipment) => (
                    <tr 
                      key={equipment.id} 
                      className={`equipment-row ${selectedItems[equipment.id] > 0 ? 'selected-row' : ''}`}
                    >
                      <td className="equipment-name">{equipment.name}</td>
                      <td className="text-center stock-column">
                        <span className={`stock-badge ${equipment.stocks < 5 ? 'low-stock' : ''}`}>
                          {equipment.stocks}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="quantity-value">
                          {selectedItems[equipment.id] || 0}
                        </span>
                      </td>
                      <td>
                        <div className="quantity-control-centered">
                          <button
                            className="quantity-btn minus-btn"
                            onClick={() =>
                              handleSelectionChange(equipment.id, (selectedItems[equipment.id] || 0) - 1)
                            }
                            disabled={(selectedItems[equipment.id] || 0) <= 0}
                            aria-label="Decrease quantity"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <button
                            className="quantity-btn plus-btn"
                            onClick={() =>
                              handleSelectionChange(equipment.id, (selectedItems[equipment.id] || 0) + 1)
                            }
                            disabled={(selectedItems[equipment.id] || 0) >= equipment.stocks}
                            aria-label="Increase quantity"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">
                      {searchQuery ? `No equipment found matching "${searchQuery}".` : 'No equipment available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <button 
          className={`next-button ${selectedCount > 0 ? 'active' : ''}`} 
          onClick={handleNext}
          disabled={selectedCount === 0}
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
          {selectedCount > 0 && <span className="item-count">{selectedCount}</span>}
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <Logout setShowModal={setShowLogoutModal} />}
    </div>
  );
};

export default BorrowItem;