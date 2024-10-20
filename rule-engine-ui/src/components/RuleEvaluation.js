import React, { useState } from 'react';
import "../components/styleForm.css"
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const RuleEvaluation = () => {
  const [attributes, setAttributes] = useState({
    age: '',
    department: '',
    salary: '',
    experience: '',
  });
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [ruleId, setRuleId] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttributes({
      ...attributes,
      [name]: value,
    });
  };

  const handleEvaluate = async () => {
    setError(''); 

    // Basic validation to check if all fields and ruleId are filled
    if (!ruleId || Object.values(attributes).some(val => val === '')) {
      setError('Please fill all fields and enter a Rule ID.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/rules/evaluate`, {
        ruleId: ruleId,
        data: attributes
      });
      setEvaluationResult(response.data.result);
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        setError('Error: No response from the server');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className='heading'>
      <h2>Evaluate Rule</h2>
      <input 
        type="text" 
        placeholder="Enter Rule ID" 
        value={ruleId} 
        onChange={(e) => setRuleId(e.target.value)} 
      />
      <div>
        <label>Age:</label>
        <input 
          type="number" 
          name="age" 
          value={attributes.age} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Department:</label>
        <input 
          type="text" 
          name="department" 
          value={attributes.department} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Salary:</label>
        <input 
          type="number" 
          name="salary" 
          value={attributes.salary} 
          onChange={handleChange} 
        />
      </div>
      <div>
        <label>Experience:</label>
        <input 
          type="number" 
          name="experience" 
          value={attributes.experience} 
          onChange={handleChange} 
        />
      </div>
      <button onClick={handleEvaluate}>Evaluate</button>
      {evaluationResult !== null && (
        <p>Evaluation Result: {evaluationResult ? 'True' : 'False'}</p>
      )}
      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
    </div>
  );
};

export default RuleEvaluation;
