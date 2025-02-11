import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Layouts/Header';
import LandingPage from './landingPage';
import React from 'react';

function App() {
  const RenderRoute = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
    </Routes>
  );

  return (
    <Router>
      
      {RenderRoute()}
    </Router>
  );
}

export default App;
