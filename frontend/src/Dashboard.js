import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/skills');
    setSkills(response.data);
  } catch (error) {
    console.error('Error fetching skills:', error);
  }
};

  const categoryData = () => {
    const categories = {};
    skills.forEach(skill => {
      categories[skill.resource] = (categories[skill.resource] || 0) + 1;
    });
    return {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#78C2AD'],
        hoverOffset: 4
      }]
    };
  };

  const progressData = () => {
    const progressCount = { started: 0, in_progress: 0, completed: 0 };
    skills.forEach(skill => {
      const state = skill.progress.toLowerCase().replace(' ', '_');
      progressCount[state] = (progressCount[state] || 0) + 1;
    });
    return {
      labels: ['Started', 'In Progress', 'Completed'],
      datasets: [{
        label: 'Skill Progress',
        data: [progressCount.started, progressCount.in_progress, progressCount.completed],
        backgroundColor: ['#FFA07A', '#87CEFA', '#90EE90']
      }]
    };
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/skills/${id}`);
    fetchSkills(); // refresh the list
  } catch (error) {
    console.error('Failed to delete skill:', error);
  }
};


  return (
    <div className="dashboard-container">
      <h2>SkillStack Dashboard</h2>
      <div className="charts-section">
        <div className="chart-card">
          <h3>Category-wise Breakdown</h3>
          <Pie data={categoryData()} />
        </div>
        <div className="chart-card">
          <h3>Progress Overview</h3>
          <Bar data={progressData()} />
        </div>
      </div>

      <div className="skills-table">
        <h3>All Skills</h3>
        <table>
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
                <td>{skill.skill}</td>
                <td>{skill.resource}</td>
                <td>{skill.platform}</td>
                <td>{skill.progress}</td>
                <td>{skill.hours}</td>
                <td>{skill.difficulty}</td>
                <td>
                  <button>Edit</button>
                  <button onClick={() => handleDelete(skill.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;