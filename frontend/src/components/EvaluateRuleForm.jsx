import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const EvaluateRuleForm = () => {
  const [ruleId, setRuleId] = useState('');
  const [data, setData] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(data);
      const response = await axios.post('http://localhost:5000/api/rules/evaluate-rule', {
        ruleId: ruleId,
        userData: parsedData
      });
      setResult(`Evaluation result: ${response.data.result}`);
    } catch (error) {
      setResult('Error evaluating rule');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Evaluate Rule</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ruleId">
          <Form.Label>Enter Rule ID:</Form.Label>
          <Form.Control
            type="text"
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
            placeholder="e.g., ruleId1"
          />
        </Form.Group>

        <Form.Group controlId="data">
          <Form.Label>Enter Data (JSON format):</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder='e.g., { "age": 35, "salary": 60000 }'
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Evaluate Rule
        </Button>
      </Form>
      {result && <Alert variant="info">{result}</Alert>}
    </div>
  );
};

export default EvaluateRuleForm;
