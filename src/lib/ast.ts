export interface Program {
  statements: Statement[];
}

export interface LetStatement {
  kind: "let";
  name: Identifier;
  value: Expression;
}

export interface ReturnStatement {
  kind: "return";
  returnValue: Expression;
}

export interface Identifier {
  kind: "identifier";
  value: string;
}

export type Statement = LetStatement | ReturnStatement;
export type Expression = Identifier;
export type Node = Statement | Expression;
