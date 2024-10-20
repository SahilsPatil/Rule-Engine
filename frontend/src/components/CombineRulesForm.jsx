import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const CombineRulesForm = () => {
  const [ruleIds, setRuleIds] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rules/combine-rules', {
        ruleIds: ruleIds
      });
      setMessage('Rules combined successfully : ' + response.data.combinedRuleId);
    } catch (error) {
      setMessage('Error combining rules');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Combine Rules</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ruleIds">
          <Form.Label>Enter Rule IDs (comma-separated):</Form.Label>
          <Form.Control
            type="text"
            value={ruleIds}
            onChange={(e) => setRuleIds(e.target.value)}
            placeholder="e.g., ruleId1, ruleId2"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Combine Rules
        </Button>
      </Form>
      {message && <Alert variant="info">{message}</Alert>}
    </div>
  );
};

export default CombineRulesForm;
