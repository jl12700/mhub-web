import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SetPassword from './components/SetPassword';
import TermsAndConditions from './components/TermsAndConditions';
import Dashboard from './components/Dashboard';
import BorrowItem from './components/BorrowItem';
import BorrowDetails from './components/BorrowDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/borrow" element={<BorrowItem />} />
        <Route path="/borrow-details" element={<BorrowDetails />} />
      </Routes>
    </Router>
  );
};

export default App;