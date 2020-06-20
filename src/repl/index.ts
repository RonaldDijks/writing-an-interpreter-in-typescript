import readline from "readline";
import { Lexer } from "../lib/lexer";
import { Parser } from "../lib/parser";
import * as ast from "./../lib/ast";

export const start = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();

  rl.on("line", (input) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    console.log(parser.errors);
    console.log(program && ast.toString(program));
    rl.prompt();
  });
};
