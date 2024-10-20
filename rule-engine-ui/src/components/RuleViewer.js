import React, { useState } from 'react';
import axios from 'axios';

const RuleViewer = () => {
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [ast, setAst] = useState(null);

  const handleViewAst = async () => {
    try {
      const response = await axios.get(`/api/rules/${selectedRuleId}`);
      setAst(response.data.ast);
    } catch (error) {
      console.error('Error fetching AST:', error);
    }
  };
  

  return (
    <div>
      <h2>View Rule AST</h2>
      <input 
        type="text" 
        placeholder="Enter Rule ID" 
        value={selectedRuleId} 
        onChange={(e) => setSelectedRuleId(e.target.value)} 
      />
      <button onClick={handleViewAst}>View AST</button>
      {ast && (
        <pre>{JSON.stringify(ast, null, 2)}</pre>
      )}
    </div>
  );
};

export default RuleViewer;
