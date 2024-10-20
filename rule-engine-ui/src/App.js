import React from 'react';
import RuleForm from './components/RuleForm';
import RuleList from './components/RuleList';
import RuleEvaluation from './components/RuleEvaluation';
import CombineRulesForm from './components/CombineRulesForm'; 
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <h1>Rule Engine</h1>
      <RuleForm />
      <RuleList />
      <CombineRulesForm />
      <RuleEvaluation />
      {/* <RuleViewer /> */}
    </div>
  );
}

export default App;

