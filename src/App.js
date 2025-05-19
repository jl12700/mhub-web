import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SetPassword from './components/SetPassword';
import TermsAndConditions from './components/TermsAndConditions';
import Dashboard from './components/Dashboard';
import BorrowItem from './components/BorrowItem';
import BorrowDetails from './components/BorrowDetails';
import UserProfile from './components/UserProfile';
import Logout from './components/Logout';
import AdminReservations from './components/AdminReservations'; // Import AdminReservations
import AdminInventory from './components/AdminInventory'; // Import AdminInventory
import AdminStatistics from './components/AdminStatistics'; // Import AdminStatistics

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/borrow" element={<BorrowItem />} />
        <Route path="/borrow-details" element={<BorrowDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/logout" element={<Logout />} />
        {/* Admin Routes */}
        <Route path="/admin/reservations" element={<AdminReservations />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
      </Routes>
    </Router>
  );
};

export default App;