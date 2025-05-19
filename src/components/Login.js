import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const navigate = useNavigate();

  const handleIdNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIdNumber(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminCredentials = { username: 'admin123', password: 'admin123' };
    const studentPassword = 'student123';
    const facultyPassword = 'faculty123';

    if (userType === 'admin') {
      if (email === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('user', JSON.stringify({ email, idNumber, userType }));
        navigate('/admin/reservations'); // Redirect to admin reservations screen
      } else {
        alert('Invalid admin credentials');
      }
    } else if (userType === 'student') {
      if (email.endsWith('@dlsl.edu.ph') && password === studentPassword) {
        localStorage.setItem('user', JSON.stringify({ email, idNumber, userType }));
        navigate('/set-password'); // Redirect to set password screen
      } else {
        alert('Invalid student credentials. Make sure you are using your school email and correct password.');
      }
    } else if (userType === 'faculty') {
      if (email.endsWith('@dlsl.edu.ph') && password === facultyPassword) {
        localStorage.setItem('user', JSON.stringify({ email, idNumber, userType }));
        navigate('/set-password'); // Redirect to set password screen
      } else {
        alert('Invalid faculty credentials. Make sure you are using your school email and correct password.');
      }
    }
  };

  return (
    <div className="login-container">
      <img src="/dlsl-logo.png" alt="DLSL Logo" className="llogo" />
      <h2>MHUB Reservation</h2>
      <form onSubmit={handleSubmit}>
        <div className="lform-group drop">
          <label>Role:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="lform-group">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="lform-group">
          <label>ID Number:</label>
          <input
            type="text"
            value={idNumber}
            onChange={handleIdNumberChange}
            required
          />
        </div>
        <div className="lform-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
