import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Alert } from 'react-bootstrap';

const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rules/rules');
        setRules(response.data);
      } catch (error) {
        setError('Error fetching rules');
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Existing Rules</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {rules.map((rule) => (
          <ListGroup.Item key={rule._id}>
            {rule.ruleString} - (ID: {rule._id})
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default RuleList;
