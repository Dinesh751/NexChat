import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  Register  from './components/RegistrationForm';
import Login from './components/LoginForm';

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
