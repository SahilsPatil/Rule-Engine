const mongoose = require('mongoose');

const ruleNodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['operand', 'operator'],
    required: true,
  },
  operator: {
    type: String,
    enum: ['AND', 'OR'],
    required: function() { return this.type === 'operator'; }
  },
  field: {
    type: String,
    required: function() { return this.type === 'operand'; }
  },
  comparison: {
    type: String,
    required: function() { return this.type === 'operand'; }
  },
  value: {
    type: String,
    required: function() { return this.type === 'operand'; }
  },
  left: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RuleNode'
  },
  right: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RuleNode'
  }
});

const RuleNode = mongoose.model('RuleNode', ruleNodeSchema);
module.exports = RuleNode;
