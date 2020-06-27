import readline from "readline";
import { Lexer } from "../lib/lexer";
import { Parser } from "../lib/parser";
import * as evaluator from "../lib/evaluator";
import * as obj from "./../lib/object";

export const start = (): void => {
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
    if (!program) throw new Error("Expected program");
    if (parser.errors.length) {
      console.log(parser.errors);
    } else {
      const evaluated = evaluator.evaluate(program);
      if (evaluated) {
        console.log(obj.toString(evaluated));
      }
    }

    rl.prompt();
  });
};
