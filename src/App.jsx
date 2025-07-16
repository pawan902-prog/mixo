import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomeScreen from "./MasterComponents/HomeScreen";
import GenderSelection from "./MasterComponents/genderSelection";
import PhotoClick from "./MasterComponents/photoClick";
import ScannerOutput from "./MasterComponents/ScannerOutPut";
import PhotoBoothScreen from "./MasterComponents/photoBooth";

// Redirection logic for `/`

// Optional layout wrapper


const App = () => {
  return (
    <Routes>
      {/* Main route wrapper */}
      <Route path="/" element={<HomeScreen />}>

      </Route>
      <Route path="/genderSelection" element={<GenderSelection />}>

      </Route>
      <Route path="/PhotoClick" element={<PhotoClick />}>
      </Route>
      <Route path="/ScannerOutput" element={<ScannerOutput />}></Route>
      <Route path="/PhotoBoothScreen" element={<PhotoBoothScreen />}></Route>
    </Routes>
  );
};

export default App;
