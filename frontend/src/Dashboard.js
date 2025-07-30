import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './Dashboard.css';

function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      drawPieChart();
      drawBarChart();
    }
  }, [skills]);

  const fetchSkills = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/skills');
      const data = await res.json();
      setSkills(data);

      const recRes = await fetch('http://localhost:5000/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: data })
      });
      const recData = await recRes.json();
      setRecommendations(recData.recommendations);
    } catch (err) {
      console.error('Error fetching skills or recommendations:', err);
    }
  };

  const drawPieChart = () => {
    const ctx = document.getElementById('pieChart');
    if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

    const progressCounts = { Started: 0, 'In Progress': 0, Completed: 0 };
    skills.forEach(skill => {
      progressCounts[skill.progress] = (progressCounts[skill.progress] || 0) + 1;
    });

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(progressCounts),
        datasets: [{
          data: Object.values(progressCounts),
          backgroundColor: ['#f39c12', '#3498db', '#2ecc71']
        }]
      }
    });
  };

  const drawBarChart = () => {
    const ctx = document.getElementById('barChart');
    if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

    const timeMap = {};
    skills.forEach(skill => {
      const name = skill.skill;
      timeMap[name] = (timeMap[name] || 0) + skill.hours;
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(timeMap),
        datasets: [{
          label: 'Hours Spent',
          data: Object.values(timeMap),
          backgroundColor: '#8e44ad'
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  };

  const deleteSkill = async (id) => {
    await fetch(`http://localhost:5000/api/skills/${id}`, {
      method: 'DELETE'
    });
    fetchSkills();
  };

  return (
    <div className="dashboard">
      <h2>Skill Insights Dashboard</h2>

      <div className="charts-container-vertical">
        <div className="chart-box">
          <h4>Progress Breakdown</h4>
          <canvas id="pieChart"></canvas>
        </div>
        <div className="chart-box">
          <h4>Time Spent per Skill</h4>
          <canvas id="barChart"></canvas>
        </div>
      </div>

      <h3> Skills Table</h3>
      <table className="skills-table">
        <thead>
          <tr>
            <th style={{ color: 'black' }}>Skill</th>
            <th style={{ color: 'black' }}>Resource</th>
            <th style={{ color: 'black' }}>Platform</th>
            <th style={{ color: 'black' }}>Progress</th>
            <th style={{ color: 'black' }}>Hours</th>
            <th style={{ color: 'black' }}>Difficulty</th>
            <th style={{ color: 'black' }}>Delete</th>
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
                <button onClick={() => deleteSkill(skill.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Recommended Resources</h3>
      <div className="recommendation-container">
        {recommendations.map((rec, index) => (
        <div
      className="recommendation-box"
      key={index}
      dangerouslySetInnerHTML={{ __html: rec }}
    ></div>
  ))}
</div>
    </div>
  );
}

export default Dashboard;
