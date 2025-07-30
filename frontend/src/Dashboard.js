import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const res = await fetch("http://localhost:5000/api/skills");
    const data = await res.json();
    setSkills(data);
    fetchRecommendations(data);
  };

  const fetchRecommendations = async (skillList) => {
    try {
      const res = await fetch("http://localhost:5000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillList }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updated = skills.filter((skill) => skill.id !== id);
        setSkills(updated);
        fetchRecommendations(updated);
      } else {
        console.error("Failed to delete skill");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // PieChart data
  const progressCount = skills.reduce(
    (acc, curr) => {
      acc[curr.progress] = (acc[curr.progress] || 0) + 1;
      return acc;
    },
    { Started: 0, "In Progress": 0, Completed: 0 }
  );

  const pieData = {
    labels: ["Started", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          progressCount["Started"],
          progressCount["In Progress"],
          progressCount["Completed"],
        ],
        backgroundColor: ["#f9c74f", "#90be6d", "#577590"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>📊 Skill Progress Dashboard</h2>

      <div className="chart-section">
        <h3>Progress Overview</h3>
        <Pie data={pieData} />
      </div>

      <div className="table-section">
        <h3>📚 Skill Entries</h3>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Resource</th>
              <th>Platform</th>
              <th>Progress</th>
              <th>Hours</th>
              <th>Difficulty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.skill}</td>
                <td>{skill.resource}</td>
                <td>{skill.platform}</td>
                <td>{skill.progress}</td>
                <td>{skill.hours}</td>
                <td>{skill.difficulty}</td>
                <td>
                  <button onClick={() => handleDelete(skill.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="recommendation-section">
        <h3>🤖 Recommended Resources</h3>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;