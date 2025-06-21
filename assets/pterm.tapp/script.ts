import { Argument } from './types';
import { parseArgs } from './utils';
import { loadCommands, getCommand } from './command-registry';
import { TerminalIO } from './types';

const terminal = document.getElementById('terminal')!;
const output = document.getElementById('output')!;
const input = document.getElementById('input') as HTMLInputElement;
const promptElement = document.getElementById('prompt') as HTMLSpanElement;

let currentPath = `/home/${sessionStorage.getItem("currAcc") || 'user'}`;
let commandInProgress = false;

document.addEventListener('DOMContentLoaded', async () => {
    await loadCommands();
    createPrompt();
});

function updatePrompt() {
  promptElement.textContent = ` ${currentPath} ➤ `;
}

async function handleCommand(command: string) {
    commandInProgress = true;
    const commandOutput = document.createElement('div');
    commandOutput.innerHTML = `<span class="prompt-host">user@terbium</span>:<span class="prompt-path">${currentPath}</span><span class="prompt-arrow"> ➤ </span>${escapeHtml(command)}`;
    output.appendChild(commandOutput);

    const commandTrimmed = command.trim();
    const firstSpaceIndex = commandTrimmed.indexOf(' ');

    let cmdName: string;
    let argsString: string;

    if (firstSpaceIndex === -1) {
        cmdName = commandTrimmed;
        argsString = '';
    } else {
        cmdName = commandTrimmed.substring(0, firstSpaceIndex);
        argsString = commandTrimmed.substring(firstSpaceIndex + 1);
    }

    const parsedArgs: Argument = parseArgs(argsString);
    const commandToExecute = getCommand(cmdName);

    const io: TerminalIO = {
        write: (data: string) => {
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = data.replace(/\n/g, '<br>');
            output.appendChild(resultDiv);
            terminal.scrollTop = terminal.scrollHeight;
        },
        read: (prompt = ''): Promise<string> => {
            return new Promise((resolve) => {
                const promptLine = document.createElement('div');
                const promptSpan = document.createElement('span');
                promptSpan.textContent = prompt;
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.className = 'inline-input';

                promptLine.appendChild(promptSpan);
                promptLine.appendChild(inputField);
                output.appendChild(promptLine);
                inputField.focus();

                const onKeyDown = (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        inputField.removeEventListener('keydown', onKeyDown);
                        inputField.disabled = true;
                        resolve(inputField.value);
                    }
                };
                inputField.addEventListener('keydown', onKeyDown);
            });
        }
    };

    if (commandToExecute) {
        const context = { currentPath };
        try {
            const result = await commandToExecute.execute(io, context, parsedArgs);
            if (result && result.newPath) {
                currentPath = result.newPath;
            }
        } catch (e: any) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = `Error: ${e.message}`;
            errorDiv.style.color = 'red';
            output.appendChild(errorDiv);
        }
    } else if (cmdName) {
        const result = document.createElement('div');
        result.textContent = `Command not found: ${cmdName}`;
        result.style.color = 'red';
        output.appendChild(result);
    }

    terminal.scrollTop = terminal.scrollHeight;
    commandInProgress = false;
    createPrompt();
}

input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !commandInProgress) {
        const command = input.value;
        input.value = '';
        input.style.display = 'none'; // Hide main input during command execution
        promptElement.style.display = 'none';
        handleCommand(command);
    }
});

function showWelcomeMessage() {
  const welcomeMessage = document.createElement('div');
  welcomeMessage.innerHTML = `
    <span style="color: #00e8c6;">Welcome to Pterm!</span><br>
    <span>Type 'help' for a list of available commands.</span>
  `;
  output.appendChild(welcomeMessage);
}

function createPrompt() {
  updatePrompt();
  showWelcomeMessage();
  input.style.display = 'inline-block';
  promptElement.style.display = 'inline-block';
  input.focus();
}

function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 } 