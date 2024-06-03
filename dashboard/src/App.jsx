import { useState } from "react";
import Home from "./pages/Register/Home";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ShowQuiz from "./pages/ShowQuiz/ShowQuiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:quizId" element={<ShowQuiz/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
