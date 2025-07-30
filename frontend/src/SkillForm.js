import React, { useState } from "react";
import "./SkillForm.css";

function SkillForm() {
  const [formData, setFormData] = useState({
    skill: "",
    resource: "",
    platform: "",
    progress: "Started",
    hours: 0,
    notes: "",
    difficulty: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Skill Added ✅");
      setFormData({
        skill: "",
        resource: "",
        platform: "",
        progress: "Started",
        hours: 0,
        notes: "",
        difficulty: 5,
      });
    }
  };

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      <h2>📝 Add New Skill</h2>

      <label>Skill Name</label>
      <input
        name="skill"
        value={formData.skill}
        onChange={handleChange}
        placeholder="Skill Name"
        required
      />

      <label>Resource Type</label>
      <select name="resource" value={formData.resource} onChange={handleChange}>
        <option value="">Select Resource</option>
        <option value="Video">Video</option>
        <option value="Book">Book</option>
        <option value="Website">Website</option>
      </select>

      <label>Platform</label>
      <input
        name="platform"
        value={formData.platform}
        onChange={handleChange}
        placeholder="Platform"
      />

      <label>Progress</label>
      <select name="progress" value={formData.progress} onChange={handleChange}>
        <option value="Started">Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <label>Hours Spent</label>
      <input
        name="hours"
        type="number"
        value={formData.hours}
        onChange={handleChange}
        placeholder="Hours spent"
      />

      <label>Notes</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
      />

      <label>Difficulty Rating (1 to 10)</label>
      <input
        name="difficulty"
        type="number"
        min="1"
        max="10"
        value={formData.difficulty}
        onChange={handleChange}
      />

      <button type="submit">Add Skill</button>
    </form>
  );
}

export default SkillForm;
