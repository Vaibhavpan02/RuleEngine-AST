class Node {
  constructor(type, value = null, left = null, right = null) {
    this.type = type;
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function parseCondition(condition) {
  const regex = /(\w+)\s*(>|<|=)\s*([\w\s]+)/;
  const match = condition.match(regex);
  if (match) {
    return new Node("operand", {
      field: match[1],
      operator: match[2],
      value: isNaN(match[3]) ? match[3].trim() : parseFloat(match[3]),
    });
  }
  throw new Error("Invalid condition format");
}

function create_rule(ruleString) {
  const operatorRegex = /\s*(AND|OR)\s*/;
  let parts = ruleString.split(operatorRegex).filter(Boolean);

  if (parts.length === 1) {
    return parseCondition(parts[0]);
  }

  let stack = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].match(operatorRegex)) {
      let right = stack.pop();
      let left = stack.pop();
      stack.push(new Node("operator", parts[i], left, right));
    } else {
      stack.push(parseCondition(parts[i]));
    }
  }

  return stack[0];
}

function combine_rules(asts) {
  if (!asts || asts.length === 0) {
    throw new Error("No ASTs provided to combine");
  }

  let combinedAST = asts[0];

  for (let i = 1; i < asts.length; i++) {
    let nextAST = asts[i];
    combinedAST = new Node("operator", "AND", combinedAST, nextAST); 
  }

  return combinedAST;
}

function evaluate_rule(node, data) {
  if (!node) {
    console.error("Node is null or undefined");
    return false;
  }

  if (node.type === "operator") {
    const leftResult = evaluate_rule(node.left, data);
    const rightResult = evaluate_rule(node.right, data);

    console.log(`Evaluating operator: ${node.value}`);
    console.log(`Left result: ${leftResult}`);
    console.log(`Right result: ${rightResult}`);

    if (node.value === "AND") {
      return leftResult && rightResult;
    } else if (node.value === "OR") {
      return leftResult || rightResult;
    } else {
      console.error(`Unknown operator type "${node.value}"`);
      return false;
    }
  } else if (node.type === "operand") {
    const { field, operator, value } = node.value;

    if (!(field in data)) {
      console.error(`Field "${field}" is missing in data`);
      return false;
    }

    const fieldValue = data[field];

    console.log(`Evaluating operand: ${field} ${operator} ${value}`);
    console.log(`Field value: ${fieldValue}`);

    switch (operator) {
      case ">":
        return fieldValue > value;
      case "<":
        return fieldValue < value;
      case "=":
        return fieldValue === value;
      case ">=":
        return fieldValue >= value;
      case "<=":
        return fieldValue <= value;
      case "!=":
        return fieldValue !== value;
      default:
        console.error(`Unknown operator "${operator}"`);
        return false;
    }
  } else {
    console.error("Invalid node type");
    return false;
  }
}

module.exports = {
  create_rule,
  combine_rules,
  evaluate_rule,
};
