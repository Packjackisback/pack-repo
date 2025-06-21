import { Command, CommandContext, Argument, TerminalIO, CommandResult } from "../types";
import { getCommand, getAllCommands } from "../command-registry";

function formatHelp(command: Command): string {
    let helpText = `<b>${command.name}</b>: ${command.description}`;
    if (command.usage) {
        helpText += `\nUsage: ${command.usage}`;
    }
    if (command.options && command.options.length > 0) {
        helpText += `\nOptions:`;
        for (const opt of command.options) {
            helpText += `\n  --${opt.name}${opt.alias ? `, -${opt.alias}` : ''}: ${opt.description}`;
        }
    }
    return helpText;
}

const helpCommand: Command = {
  name: "help",
  description: "Displays a list of available commands, or detailed help for a specific command.",
  usage: "help [command]",
  execute: async (io: TerminalIO, context: CommandContext, args: Argument): Promise<CommandResult> => {
    if (args.normal.length > 0) {
        const commandName = args.normal[0];
        const command = getCommand(commandName);
        if (command) {
            io.write(formatHelp(command) + '\n');
        } else {
            io.write(`Unknown command: ${commandName}\n`);
        }
    } else {
        const commands = getAllCommands();
        let output = "Available commands:\n";
        for (const cmd of commands) {
            output += `  ${cmd.name}: ${cmd.description}\n`;
        }
        io.write(output);
    }
  },
};

export default helpCommand; 