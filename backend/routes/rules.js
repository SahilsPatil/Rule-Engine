const express = require('express');
const router = express.Router();
const RuleNode = require('../models/RuleNode');
const CopiedRuleNode = require('../models/CopiedRuleNode');

// Helper function to parse condition from string
const parseCondition = (conditionStr) => {
  const comparisonOperators = ['>=', '<=', '!=', '=', '>', '<'];
  let comparison, field, value;

  // Find the comparison operator
  for (let op of comparisonOperators) {
    if (conditionStr.includes(op)) {
      comparison = op;
      [field, value] = conditionStr.split(op);
      break;
    }
  }
  field = field.trim();
  value = value.trim();
  if (isNaN(value)) {
    value = `'${value}'`; 
  }
  return { field, comparison, value };
};


// Helper function to create AST
const createAST = async (ruleString) => {
  ruleString = ruleString.trim();
  if (ruleString.startsWith('(') && ruleString.endsWith(')')) {
    ruleString = ruleString.substring(1, ruleString.length - 1); // Remove outer parentheses
    console.log("if Rule - " + ruleString);

  }

  let parenthesesDepth = 0;
  let mainOperator = null;
  let operatorIndex = -1;

  // Identify the main operator outside any parentheses
  for (let i = 0; i < ruleString.length; i++) {
    const char = ruleString[i];
    if (char === '(') parenthesesDepth++;
    if (char === ')') parenthesesDepth--;
    if (parenthesesDepth === 0 && (ruleString.slice(i, i + 3) === 'AND' || ruleString.slice(i, i + 2) === 'OR')) {
      mainOperator = ruleString.slice(i, i + 3).trim();
      operatorIndex = i;
      break;
    }
  }

  if (mainOperator) {
    const leftPart = ruleString.slice(0, operatorIndex).trim();
    const rightPart = ruleString.slice(operatorIndex + mainOperator.length).trim();

    const leftNode = await createAST(leftPart);
    const rightNode = await createAST(rightPart);

    await leftNode.save();
    await rightNode.save();

    const operatorNode = new RuleNode({
      type: 'operator',
      operator: mainOperator,
      left: leftNode._id,
      right: rightNode._id
    });
    return operatorNode;
  } 
  else {
    const condition = parseCondition(ruleString);
    const operandNode = new RuleNode({
      type: 'operand',
      field: condition.field,
      comparison: condition.comparison,
      value: condition.value
    });

    await operandNode.save();

    return operandNode;
  }
};


// Helper function to evaluate a single condition
const evaluateCondition = (field, comparison, value, user) => {
  const userValue = user[field];

  // Remove single quotes from condition value if present
  if (typeof value === 'string') {
    value = value.replace(/['"]+/g, ''); 
  }

  if (typeof userValue === 'string') {
    if (comparison === '=') return userValue === value;
    if (comparison === '!=') return userValue !== value;
  }

  if (typeof userValue === 'number') {
    const numericValue = Number(value);
    switch (comparison) {
      case '>': return userValue > numericValue;
      case '<': return userValue < numericValue;
      case '>=': return userValue >= numericValue;
      case '<=': return userValue <= numericValue;
      case '=': return userValue == numericValue;
      case '!=': return userValue != numericValue;
    }
  }

  return false;
};


// Recursive function to evaluate a rule based on the AST
const evaluateRule = async (ruleNodeId, user) => {
  try {
    // Fetch rule node and populate its children
    const ruleNode = await RuleNode.findById(ruleNodeId).populate('left right').exec();

    if (!ruleNode) {
      throw new Error(`RuleNode with id ${ruleNodeId} not found.`);
    }
    if (ruleNode.type === 'operand') {
      return evaluateCondition(ruleNode.field, ruleNode.comparison, ruleNode.value, user);
    }
    if (!ruleNode.left || !ruleNode.right) {
      console.error(`Missing nodes: Left: ${ruleNode.left}, Right: ${ruleNode.right}`);
      throw new Error(`One or both child nodes (left or right) are null for rule node with id ${ruleNode._id}`);
    }

    // Recursively evaluate left and right nodes
    const leftResult = await evaluateRule(ruleNode.left._id, user);
    const rightResult = await evaluateRule(ruleNode.right._id, user);

    if (ruleNode.operator === 'AND') {
      return leftResult && rightResult;
    } else if (ruleNode.operator === 'OR') {
      return leftResult || rightResult;
    } else {
      throw new Error(`Unknown operator: ${ruleNode.operator}`);
    }
  } catch (err) {
    console.error(`Error evaluating rule: ${err.message}`);
    throw new Error('Error evaluating rule');
  }
};


// Function to combine multiple rules into a single AST
const combineRules = async (ruleIds) => {
  try {
    // Fetch the corresponding rule nodes from the database
    const ruleNodes = await RuleNode.find({ _id: { $in: ruleIds } });

    if (ruleNodes.length < 2) {
      throw new Error('At least two rules are required to combine.');
    }

    // Combine rules using 'AND' operator (this can be optimized based on the use case)
    // You can use 'OR' or any other strategy based on requirements
    let combinedAST = new RuleNode({
      type: 'operator',
      operator: 'AND', // Combining all rules with AND logic
      left: ruleNodes[0]._id,
      right: ruleNodes[1]._id,
    });

    // If more than two rules, combine recursively
    for (let i = 2; i < ruleNodes.length; i++) {
      combinedAST = new RuleNode({
        type: 'operator',
        operator: 'AND', // Using AND as default, can be optimized
        left: combinedAST._id,
        right: ruleNodes[i]._id,
      });
    }

    // Save the final combined node in the RuleNode collection
    const savedCombinedNode = await combinedAST.save();

    // Copy the saved node to the CopiedNode collection
    const copiedCombinedNode = new CopiedRuleNode({
      _id: savedCombinedNode._id,  // Keeping the same ID
      type: savedCombinedNode.type,
      operator: savedCombinedNode.operator,
      left: savedCombinedNode.left,
      right: savedCombinedNode.right,
    });
    await copiedCombinedNode.save();

    return savedCombinedNode; // Return the root node of the combined AST
  } catch (err) {
    console.error('Error combining rules:', err);
    throw err;
  }
};






//--------------------------------------API ENDPOINTS------------------------------------------------------------
// API endpoint to evaluate a rule
router.post('/evaluate-rule', async (req, res) => {
  try {
    const { ruleId, userData } = req.body;
    const result = await evaluateRule(ruleId, userData); 
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Error evaluating rule' });
  }
});


// Create rule endpoint
router.post('/create-rule', async (req, res) => {
  try {
    const { ruleString } = req.body;
    const ast = await createAST(ruleString); 
    const savedNode = await ast.save(); 
    const copiedNode = new CopiedRuleNode({
      _id: savedNode._id,  
      type: savedNode.type,
      operator: savedNode.operator,
      field: savedNode.field,
      comparison: savedNode.comparison,
      value: savedNode.value,
      left: savedNode.left,
      right: savedNode.right
    });

    await copiedNode.save();
    res.status(200).json({ ruleId: savedNode._id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating rule' });
  }
});


// Endpoint to get all copied nodes from the CopiedNode collection
router.get('/rules', async (req, res) => {
  try {
    const copiedNodes = await CopiedRuleNode.find().exec();

    res.status(200).json(copiedNodes);
  } catch (err) {
    console.error('Error fetching copied nodes:', err);
    res.status(500).json({ error: 'Error fetching copied nodes' });
  }
});


// API endpoint to combine multiple rules
router.post('/combine-rules', async (req, res) => {
  try {
    const { ruleIds } = req.body;
    const ruleIdArray = ruleIds.split(',').map(id => id.trim());
    const combinedNode = await combineRules(ruleIdArray);

    res.status(200).json({ combinedRuleId: combinedNode._id });
  } catch (err) {
    res.status(500).json({ error: 'Error combining rules' });
  }
});




module.exports = router;
