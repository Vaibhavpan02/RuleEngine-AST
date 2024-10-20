// models/rule.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Node Schema for the API
const NodeSchema = new Schema({
    type: { type: String, required: true },
    value: { type: Schema.Types.Mixed },
    left: { type: Schema.Types.Mixed, default: null },
    right: { type: Schema.Types.Mixed, default: null }
});

// Schema for the rule
const RuleSchema = new Schema({
    name: { type: String, required: true },
    ast: NodeSchema 
});

const Rule = mongoose.model('Rule', RuleSchema);
module.exports = Rule;