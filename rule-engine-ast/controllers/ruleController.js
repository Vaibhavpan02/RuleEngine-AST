const {
  create_rule,
  combine_rules,
  evaluate_rule,
} = require("../services/ruleService");
const Rule = require("../models/rule");
const mongoose = require("mongoose");

// Create Rule API
exports.create_rule = async (req, res) => {
  try {
    const { ruleString } = req.body;
    const ast = create_rule(ruleString);

    const rule = new Rule({ name: `rule_${Date.now()}`, ast });
    await rule.save();

    res.json({ message: "Rule created successfully", rule });
  } catch (error) {
    res.status(500).json({ message: "Error creating rule", error });
  }
};

// Combine Rules API
exports.combine_rules = async (req, res) => {
  try {
    const { ruleIds } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    if (rules.length === 0) {
      return res.status(404).json({ message: "No rules found" });
    }
    const ruleStrings = rules.map((rule) => rule.ast);
    const combinedAST = combine_rules(ruleStrings);
    const combinedRule = new Rule({
      name: `combined_rule_${Date.now()}`,
      ast: combinedAST,
    });
    await combinedRule.save();
    res.json({ message: "Rules combined successfully", combinedRule });
  } catch (error) {
    res.status(500).json({ message: "Error combining rules", error });
  }
};

// Evaluate Rule API
exports.evaluate_rule = async (req, res) => {
  try {
    const { ruleId, data } = req.body;
    if (!ruleId || !data) {
      return res
        .status(400)
        .json({ message: "Missing ruleId or data in the request body" });
    }

    // Validation
    const objectId = new mongoose.Types.ObjectId(ruleId);
    if (!mongoose.Types.ObjectId.isValid(ruleId)) {
      return res.status(400).json({ message: "Invalid ruleId format" });
    }
    if (!data.age || !data.department || !data.salary || !data.experience) {
      return res.status(400).json({ message: "Incomplete data fields" });
    }
    

    // Fetch the rule from the database
    const rule = await Rule.findById(objectId);

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    // console.log(`Rule found: ${rule.name}`);

    // Evaluating the rule's AST against the provided data
    const result = evaluate_rule(rule.ast, data);

    // Returning the result with a confirmation message
    res.json({ message: `Rule "${rule.name}" found and evaluated`, result });
  } catch (error) {
    console.error("Error evaluating rule:", error);
    res
      .status(500)
      .json({ message: "Error evaluating rule", error: error.message });
  }
};
