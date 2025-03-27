import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FitnessTracker from "./Fitness-Tracker";
import Login from "./login";
import Signup from "./signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FitnessTracker />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
