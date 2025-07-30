import React from 'react';
import './Recommendation.css';

const RecommendationModal = ({ show, onClose, recommendation }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>AI Suggestion</h3>
        <p>{recommendation}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Recommendation;