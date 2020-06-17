export interface Program {
  statements: Statement[];
}

export interface LetStatement {
  name: Identifier;
  value: Expression;
}

export interface Identifier {
  value: string;
}

export type Statement = LetStatement;
export type Expression = Identifier;
export type Node = Statement | Expression;
