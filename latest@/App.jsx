import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Homepage';
import LoginPage from './LoginPage';
import SignUpPagePage from './SignUpPage'; 


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/Homepage" element={<Homepage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;