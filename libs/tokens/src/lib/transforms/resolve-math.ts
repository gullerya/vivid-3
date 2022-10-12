const { Parser } = require("expr-eval");

/**
 * Helper: Transforms math like Figma Tokens
 */
const parser = new Parser();

function checkAndEvaluateMath(expr) {
	try {
		parser.evaluate(expr);
		return +parser.evaluate(expr).toFixed();
	} catch (ex) {
    return expr;
  }
}

/**
 * Transform to resolve math across all tokens
 */
module.exports = {
  name: "resolveMath",
  type: "value",
  transitive: true,
  matcher: (token) => token,
  transformer: (token) => `${checkAndEvaluateMath(token.value)}`
};
