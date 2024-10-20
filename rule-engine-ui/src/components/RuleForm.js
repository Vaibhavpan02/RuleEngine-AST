import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const RuleForm = () => {
  const [rule, setRule] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateRule = (ruleString) => {
    // Expression to match valid comparison expressions
    const comparisonRegex = /(\w+\s*(>|<|=|>=|<=|!=)\s*["']?\w+["']?)/;
  
    const comparisons = ruleString.match(comparisonRegex);
  
    if (!comparisons || comparisons.length === 0) {
      return false;
    }
  
    // Checking for balanced parentheses
    const parenthesisBalanced = (ruleString.match(/\(/g) || []).length === (ruleString.match(/\)/g) || []).length;
    if (!parenthesisBalanced) {
      return false;
    }
  
    const logicalOperatorsRegex = /\s+(AND|OR)\s+/;
    const hasLogicalOperators = logicalOperatorsRegex.test(ruleString);
  
    return hasLogicalOperators || comparisons.length === 1;
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate rule format
    if (!validateRule(rule)) {
      setError('Invalid rule format. Ensure it contains valid comparisons.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/rules/create`, { ruleString: rule });
      setSuccessMessage('Rule created successfully!');
      console.log('Rule created:', response.data);
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
    <div>
      <h2>Create Rule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rule:</label>
          <input 
            type="text" 
            value={rule} 
            onChange={(e) => setRule(e.target.value)} 
          />
        </div>
        <button type="submit">Create Rule</button>
      </form>
      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
      {successMessage && (
        <p style={{ color: 'green' }}>{successMessage}</p>
      )}
    </div>
  );
};

export default RuleForm;
