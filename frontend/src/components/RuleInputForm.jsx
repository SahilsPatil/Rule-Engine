import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const RuleInputForm = () => {
  const [ruleString, setRuleString] = useState('');
  const [message, setMessage] = useState('');

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rules/create-rule', {
        ruleString
      });
      setMessage(`Rule created successfully: ${response.data.ruleId}`);
    } catch (error) {
      setMessage('Error creating rule');
    }
  };
  useEffect(() => {
    
  }, [handleSubmit])
  
  return (
    <div className="container">
      <h2>Create a Rule</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ruleString">
          <Form.Label>Enter Rule:</Form.Label>
          <Form.Control
            type="text"
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            placeholder="e.g., age > 30 AND salary > 50000"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Rule
        </Button>
      </Form>
      {message && <Alert variant="info">{message}</Alert>}
    </div>
  );
};

export default RuleInputForm;
