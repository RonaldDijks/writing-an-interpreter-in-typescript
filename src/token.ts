export type Token =
  | { kind: "identifier"; text: string }
  | { kind: "integer"; text: string }
  | { kind: "illegal" }
  | { kind: "eof" }
  | { kind: "assign" }
  | { kind: "plus" }
  | { kind: "comma" }
  | { kind: "semicolon" }
  | { kind: "leftParenthesis" }
  | { kind: "rightParenthesis" }
  | { kind: "leftBrace" }
  | { kind: "rightBrace" }
  | { kind: "function" }
  | { kind: "let" };

const keywords = new Map<string, Token>([
  ["fn", { kind: "function" }],
  ["let", { kind: "let" }],
]);

export const lookupIdentifier = (text: string): Token => {
  return keywords.get(text) || { kind: "identifier", text };
};
