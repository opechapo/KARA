import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from './Layouts/Header';
import LandingPage from "./landingPage";
import React from "react";
import Electronics from "./Categories/Electronics";
import SmartPhoneTab from "./Categories/SmartPhoneAndTab";
import Vehicles from "./Categories/Vehicles";
import Fashion from "./Categories/Fashion";
import HomeGardens from "./Categories/Home&Garden";
import AboutUs from "./Layouts/Pages/AboutUs";
import Cars from "./Categories/Vehicles/Cars/Cars";
// import MercedesGwagon from './Categories/Cars/mercedesGwagon';
import MercedesGwagon from "./Categories/Vehicles/Cars/MercedesGwagon";
import Stores from "./Layouts/Pages/Stores";
import Collections from "./Layouts/Pages/Collections";
import CubannaAutosStores from "./Categories/Stores/CubannaAutosStores";
import BusAndMinibus from "./Categories/Vehicles/BusAndMiniBus/BusAndMinibus";
import MotorcycleAndTricycle from "./Categories/Vehicles/MotorcycleAndTricycle/MotorcycleAndTricycle";
import TruckAndTrailer from "./Categories/Vehicles/TrucksAndTrailers/TruckAndTrailer";
import HeavyDuty from "./Categories/Vehicles/HeavyDuty/HeavyDuty";

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
      <Route path="/bus&minibus" element={<BusAndMinibus />} />
      <Route path="/motorcycleandtricycle" element={<MotorcycleAndTricycle/>} />
      <Route path="/truckandtrailer" element={<TruckAndTrailer/>} />
      <Route path="/heavyduty" element={<HeavyDuty/>} />
      <Route path="/mercedesgwagon" element={<MercedesGwagon />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/cubannaautosstores" element={<CubannaAutosStores />} />
    </Routes>
  );

  return <Router>{RenderRoute()}</Router>;
}

export default App;
