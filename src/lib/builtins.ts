import * as obj from "./object";

export const builtins = new Map<string, obj.Builtin>([
  [
    "len",
    obj.builtin((args) => {
      if (args.length !== 1) {
        return obj.error(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }
      const arg = args[0];
      if (arg.kind === "string") {
        return obj.integer(arg.value.length);
      }
      return obj.error(`argument to \`len\` not supported, got ${arg.kind}`);
    }),
  ],
]);
