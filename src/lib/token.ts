export interface Token {
  kind: TokenKind;
  text: string;
}

export type TokenKind =
  | "identifier"
  | "integer"
  | "string"
  | "illegal"
  | "eof"
  | "assign"
  | "plus"
  | "minus"
  | "bang"
  | "asterisk"
  | "slash"
  | "lessThen"
  | "greaterThen"
  | "comma"
  | "semicolon"
  | "leftParenthesis"
  | "rightParenthesis"
  | "leftBrace"
  | "rightBrace"
  | "leftBracket"
  | "rightBracket"
  | "function"
  | "let"
  | "if"
  | "else"
  | "return"
  | "true"
  | "false"
  | "equals"
  | "notEquals";

const keywords = new Map<string, TokenKind>([
  ["fn", "function"],
  ["let", "let"],
  ["true", "true"],
  ["false", "false"],
  ["if", "if"],
  ["else", "else"],
  ["return", "return"],
]);

export const lookupIdentifier = (text: string): Token => {
  const kind = keywords.get(text);
  if (kind) {
    return { kind, text };
  }
  return { kind: "identifier", text };
};
