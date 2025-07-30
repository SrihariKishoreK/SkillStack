import React, { useState } from "react";
import "./SkillForm.css";

const SkillForm = () => {
  const [skillName, setSkillName] = useState("");
  const [resource, setResource] = useState("Video");
  const [platform, setPlatform] = useState("Udemy");
  const [progress, setProgress] = useState("Started");
  const [hoursSpent, setHoursSpent] = useState(0);
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillData = {
      skill: skillName,
      resource,
      platform,
      progress,
      hours: parseFloat(hoursSpent),
      notes,
      difficulty: parseInt(difficulty)
    };

    try {
      const response = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Skill added successfully");

        // Reset form
        setSkillName("");
        setResource("Video");
        setPlatform("Udemy");
        setProgress("Started");
        setHoursSpent(0);
        setNotes("");
        setDifficulty(1);

        // Fetch updated recommendation
        fetchRecommendation();

      } else {
        console.error("Failed to add skill:", result.error || "Unknown error");
        alert("Failed to add skill: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill: " + error.message);
    }
  };

  const fetchRecommendation = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/recommend");
      const data = await response.json();

      if (response.ok && data.recommendation) {
        // Store the latest recommendation in localStorage
        const storedRecs = JSON.parse(localStorage.getItem("recommendations")) || [];
        if (!storedRecs.includes(data.recommendation)) {
          storedRecs.push(data.recommendation);
        }
        localStorage.setItem("recommendations", JSON.stringify(storedRecs));
      }
    } catch (error) {
      console.error("Failed to fetch recommendation:", error);
    }
  };

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      <h2>Add a Learning Goal</h2>

      <input
        type="text"
        placeholder="Skill Name"
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
        required
      />

      <label>Resource Type</label>
      <select value={resource} onChange={(e) => setResource(e.target.value)}>
        <option value="Video">Video</option>
        <option value="Course">Course</option>
        <option value="Article">Article</option>
      </select>

      <label>Platform</label>
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option value="Udemy">Udemy</option>
        <option value="YouTube">YouTube</option>
        <option value="Coursera">Coursera</option>
        <option value="Other">Other</option>
      </select>

      <label>Progress</label>
      <select value={progress} onChange={(e) => setProgress(e.target.value)}>
        <option value="Started">Started</option>
        <option value="In-Progress">In-Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <label>Hours Spent</label>
      <input
        type="number"
        value={hoursSpent}
        onChange={(e) => setHoursSpent(e.target.value)}
        min="0"
      />

      <label>Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write notes..."
      />

      <label>Difficulty (1 to 10)</label>
      <input
        type="number"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        min="1"
        max="10"
        required
      />

      <button type="submit">Add Skill</button>
    </form>
  );
};

export default SkillForm;
