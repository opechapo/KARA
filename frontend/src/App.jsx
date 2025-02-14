import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from './Layouts/Header';
import LandingPage from './landingPage';
import React from 'react';
import Electronics from './Categories/Electronics';
import SmartPhoneTab from './Categories/SmartPhoneAndTab';
import Vehicles from './Categories/Vehicles';
import Fashion from './Categories/Fashion';
import HomeGardens from './Categories/Home&Garden';

function App() {
  const RenderRoute = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/electronics" element={<Electronics />} />
      <Route path="/smartphonetab" element={<SmartPhoneTab />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/Fashion" element={<Fashion />} />
      <Route path="/Home&Garden" element={<HomeGardens />} />
      
      
    </Routes>
  );

  return (
    <Router>
      
      {RenderRoute()}
    </Router>
  );
}

export default App;
