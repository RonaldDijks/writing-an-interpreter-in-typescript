import readline from "readline";
import { lex } from "../lib/lexer";

export const start = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">",
  });

  rl.prompt();

  rl.on("line", (input) => {
    const tokens = lex(input);
    for (const token of tokens) {
      const text = (token as any).text || undefined;
      if (text) {
        console.log(token.kind, (token as any).text);
      } else {
        console.log(token.kind);
      }
    }
    rl.prompt();
  });
};
