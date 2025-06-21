import { Command, CommandContext, Argument, TerminalIO, CommandResult } from "../types";

const echoCommand: Command = {
  name: "echo",
  description: "Prints the given text back to the terminal.",
  usage: "echo [text to print]",
  execute: async (io: TerminalIO, context: CommandContext, args: Argument): Promise<CommandResult> => {
    io.write(args.raw + '\n');
  },
};

export default echoCommand; 