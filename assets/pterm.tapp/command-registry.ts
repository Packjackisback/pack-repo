import { Command } from "./types";

// @ts-ignore Anura module
const Filer = window.parent.Filer;

const commands = new Map<string, Command>();

async function loadCommands(): Promise<void> {
    const scriptsPath = "/apps/pterm.tapp/scripts/";
    try {
        const files = await Filer.fs.promises.readdir(scriptsPath);

        for (const file of files) {
            if (!file.endsWith(".js")) continue;

            try {
                // @ts-ignore Anura module
                const commandModule = await import(/* @vite-ignore */ `anura://apps/pterm.tapp/scripts/${file}`);
                
                const command: Command = commandModule.default;

                if (command && command.name && command.execute) {
                    commands.set(command.name, command);
                } else {
                    console.warn(`File ${file} does not export a valid command.`);
                }
            } catch (e) {
                console.error(`Error loading command from ${file}:`, e);
            }
        }
    } catch (err) {
        console.error("Failed to read commands directory:", err);
    }
}

export function getCommand(name: string): Command | undefined {
    return commands.get(name);
}

export function getAllCommands(): Command[] {
    return Array.from(commands.values());
}

export { loadCommands }; 