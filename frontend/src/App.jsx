import React from 'react';
import RuleInputForm from './components/RuleInputForm';
import RuleList from './components/RuleList';
import CombineRulesForm from './components/CombineRulesForm';
import EvaluateRuleForm from './components/EvaluateRuleForm';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1 className="text-center mt-4">Rule Engine</h1>
        <div className="row mt-4">
          <div className="col-md-6">
            <RuleInputForm />
          </div>
          <div className="col-md-6">
            <RuleList />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <CombineRulesForm />
          </div>
          <div className="col-md-6">
            <EvaluateRuleForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
