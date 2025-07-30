import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SkillForm from "./SkillForm";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="button-container">
        <Link to="/" className="button">Add Skill</Link>
        <Link to="/dashboard" className="button">Dashboard</Link>
      </div>
      <Routes>
        <Route path="/" element={<SkillForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;