const mongoose = require('mongoose');

const CopiedRuleNodeSchema = new mongoose.Schema({
  type: String,
  operator: String,
  field: String,
  comparison: String,
  value: String,
  left: { type: mongoose.Schema.Types.ObjectId, ref: 'RuleNode' },
  right: { type: mongoose.Schema.Types.ObjectId, ref: 'RuleNode' }
});

const CopiedRuleNode = mongoose.model('CopiedRuleNode', CopiedRuleNodeSchema);

module.exports = CopiedRuleNode;
