import { Command, CommandContext, Argument, TerminalIO, CommandResult } from "../types";

const greetCommand: Command = {
    name: "greet",
    description: "Asks for your name and greets you.",
    usage: "greet",
    execute: async (io: TerminalIO, context: CommandContext, args: Argument): Promise<CommandResult> => {
        io.write("Hello! What is your name?\n");
        const name = await io.read("Name: ");
        io.write(`Nice to meet you, ${name}!\n`);
    },
};

export default greetCommand; 