import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./landingPage";
import React from "react";
import Electronics from "./Categories/Electronics";
import Vehicles from "./Categories/Vehicles";
import Fashion from "./Categories/Fashion";
import HomeGardens from "./Categories/Home&Garden";
import AboutUs from "./Layouts/Pages/AboutUs";
import Cars from "./Categories/Vehicles/Cars/Cars";
import MercedesGwagon from "./Categories/Vehicles/Cars/MercedesGwagon";
import Stores from "./Layouts/Pages/Stores";
import Collections from "./Layouts/Pages/Collections";
import CubannaAutosStores from "./Categories/Stores/CubannaAutosStores";
import BusAndMinibus from "./Categories/Vehicles/BusAndMiniBus/BusAndMinibus";
import MobilePhone from "./Categories/MobilePhonesAndTabs/MobilePhone";
import Tablets from "./Categories/MobilePhonesAndTabs/Tablets";
import SmartWatch from "./Categories/MobilePhonesAndTabs/SmartWatch";
import PhoneAndTabAccesories from "./Categories/MobilePhonesAndTabs/PhoneAndTabAccesories";
import MobilePhoneAndTabs from "./Categories/MobilePhonesAndTabs";
import MotorcycleAndTricycle from "./Categories/Vehicles/MotorcycleAndTricycle/MotorcycleAndTricycle";
import TruckAndTrailer from "./Categories/Vehicles/TrucksAndTrailers/TruckAndTrailer";
import HeavyDuty from "./Categories/Vehicles/HeavyDuty/HeavyDuty";
import MobilePhoneCategorySideBar from "./Layouts/Pages/MobilePhoneCategorySideBar";
import Furnitures from "./Categories/HomeAndGardens/Furnitures";
import HomeAppliance from "./Categories/HomeAndGardens/HomeAppliances";
import KitchenAppliances from "./Categories/HomeAndGardens/KitchenAppliances";
import HomeAccesories from "./Categories/HomeAndGardens/HomeAccesories";
import Bags from "./Categories/Fashions/Bags";
import Clothings from "./Categories/Fashions/Clothings";
import Watches from "./Categories/Fashions/Watches";
import Shoes from "./Categories/Fashions/Shoes";
import AudioAndMusicInstrument from "./Categories/Electronics/AudioAndMusicInstrument";
import Profile from './Components/Profile';
import UpdateProfile from './Components/UpdateProfile';
import Logout from './Components/LogOut';
import Store from './Components/Store';


// Placeholder components for My Listings and My Purchases
const MyListings = () => <div className="p-6">My Listings Page (To Be Implemented)</div>;
const MyPurchases = () => <div className="p-6">My Purchases Page (To Be Implemented)</div>;

function App() {
  const RenderRoute = () => (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/electronics" element={<Electronics />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/fashion" element={<Fashion />} />
      <Route path="/home&garden" element={<HomeGardens />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/vehicles/cars" element={<Cars />} />
      <Route path="/vehicles/bus&minibus" element={<BusAndMinibus />} />
      <Route
        path="/vehicles/motorcycleandtricycle"
        element={<MotorcycleAndTricycle />}
      />
      
      <Route path="/vehicles/truckandtrailer" element={<TruckAndTrailer />} />
      <Route path="/vehicles/heavyduty" element={<HeavyDuty />} />
      <Route path="/mercedesgwagon" element={<MercedesGwagon />} />
      <Route path="/mobilephoneandtabs" element={<MobilePhoneAndTabs />} />
      <Route path="/mobilephone" element={<MobilePhone />} />
      <Route path="/tablets" element={<Tablets />} />
      <Route path="/smartwatch" element={<SmartWatch />} />
      <Route
        path="/phoneandtabaccesories"
        element={<PhoneAndTabAccesories />}
      />
      <Route path="/furnitures" element={<Furnitures />} />
      <Route path="/homeappliance" element={<HomeAppliance />} />
      <Route path="/kitchenappliances" element={<KitchenAppliances />} />
      <Route path="/homeaccesories" element={<HomeAccesories />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/fashion/bags" element={<Bags />} />
      <Route path="/fashion/clothings" element={<Clothings />} />
      <Route path="/fashion/watches" element={<Watches />} />
      <Route path="/fashion/shoes" element={<Shoes />} />
      <Route path="/electronics/audioandmusicinstrument" element={<AudioAndMusicInstrument />} />
      <Route path="/cubannaautosstores" element={<CubannaAutosStores />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/my-listings" element={<MyListings />} />
      <Route path="/my-purchases" element={<MyPurchases />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/stores" element={<Store />} />
    </Routes>
  );

  return <Router>{RenderRoute()}</Router>;
}

export default App;
