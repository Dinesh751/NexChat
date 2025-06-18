import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  Register  from './components/RegistrationForm';
import Login from './components/LoginForm';
import { UserRoutes } from './guardRoutes/UserRoutes';
import HomePage from './pages/HomePage';
import PageNotFound from './components/PageNotFound';

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} /> 
          <Route element={<UserRoutes />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
