import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './Dashboard.css';

function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const chartRef = useRef(null); // reference to the chart instance

  // Fetch all skills
  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recommend');
      if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
        setRecommendations(response.data.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`);
      fetchSkills();
      fetchRecommendations();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (skills.length === 0) return;

    const progressCounts = {
      Started: 0,
      'In-Progress': 0,
      Completed: 0,
    };

    skills.forEach(skill => {
      progressCounts[skill.progress]++;
    });

    const ctx = document.getElementById('progressChart');

    // Destroy previous chart instance if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Started', 'In-Progress', 'Completed'],
        datasets: [{
          label: 'Skill Progress',
          data: [
            progressCounts.Started,
            progressCounts['In-Progress'],
            progressCounts.Completed,
          ],
          backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
        }],
      },
    });

  }, [skills]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="recommendations">
        <h3>Resource Recommendations</h3>
        {recommendations.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        )}
      </div>

      <h3>All Skills</h3>
      <table className="skill-table">
        <thead>
          <tr>
            <th>Skill</th>
            <th>Resource</th>
            <th>Platform</th>
            <th>Progress</th>
            <th>Hours</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => (
            <tr key={skill.id}>
              <td>{skill.skill_name}</td>
              <td>{skill.resource}</td>
              <td>{skill.platform}</td>
              <td>{skill.progress}</td>
              <td>{skill.hours}</td>
              <td>{skill.difficulty}</td>
              <td>
                <button onClick={() => alert('Edit feature not implemented')} className="btn btn-primary">Edit</button>
                <button onClick={() => deleteSkill(skill.id)} className="btn btn-danger" style={{ marginLeft: '5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Skill Progress Overview</h3>
      <canvas id="progressChart" width="400" height="200"></canvas>
    </div>
  );
}

export default Dashboard;