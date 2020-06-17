export type Token =
  | { kind: "identifier"; text: string }
  | { kind: "integer"; text: string }
  | { kind: "illegal" }
  | { kind: "eof" }
  | { kind: "assign" }
  | { kind: "plus" }
  | { kind: "minus" }
  | { kind: "bang" }
  | { kind: "asterisk" }
  | { kind: "slash" }
  | { kind: "lessThen" }
  | { kind: "greaterThen" }
  | { kind: "comma" }
  | { kind: "semicolon" }
  | { kind: "leftParenthesis" }
  | { kind: "rightParenthesis" }
  | { kind: "leftBrace" }
  | { kind: "rightBrace" }
  | { kind: "function" }
  | { kind: "let" }
  | { kind: "if" }
  | { kind: "else" }
  | { kind: "return" }
  | { kind: "true" }
  | { kind: "false" }
  | { kind: "equals" }
  | { kind: "notEquals" };

const keywords = new Map<string, Token>([
  ["fn", { kind: "function" }],
  ["let", { kind: "let" }],
  ["true", { kind: "true" }],
  ["false", { kind: "false" }],
  ["if", { kind: "if" }],
  ["else", { kind: "else" }],
  ["return", { kind: "return" }],
]);

export const lookupIdentifier = (text: string): Token => {
  return keywords.get(text) || { kind: "identifier", text };
};
