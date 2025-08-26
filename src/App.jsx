import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./MasterComponent/Home";
import X25_Chat_Inputs from "./MasterComponent/X25_Chat";
import QuestionScreen from "./MasterComponent/QuestionScreen";
import FinalOutPutScreen from "./MasterComponent/FinalOutputScreen";
import ChatScreen from "./MasterComponent/ChatScreen";
import ScannerScreen from "./MasterComponent/ScannerScreen";
import PDFGenerator from "./MasterComponent/PDFGenerator";
import ScrollToTop from "./scrolltop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/x25-chat" element={<X25_Chat_Inputs />} />
        <Route path="/QuestionScreen" element={<QuestionScreen />} />
        <Route path="/FinalOutPutScreen" element={<FinalOutPutScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/scanner" element={<ScannerScreen />} />
        <Route path="/pdf-generator" element={<PDFGenerator />} />
      </Routes>
    </>
  )
}
export default App