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
import AboutUs from './Layouts/Pages/AboutUs';
import Cars from './Categories/Cars';

function App() {
  const RenderRoute = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/electronics" element={<Electronics />} />
      <Route path="/smartphonetab" element={<SmartPhoneTab />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/fashion" element={<Fashion />} />
      <Route path="/home&garden" element={<HomeGardens />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/cars" element={<Cars />} />
      
      
    </Routes>
  );

  return (
    <Router>
      
      {RenderRoute()}
    </Router>
  );
}

export default App;
