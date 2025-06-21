"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const output = document.getElementById('output');
const input = document.getElementById('input');
const promptElement = document.getElementById('prompt');
const terminal = document.getElementById('terminal');
let currentPath = '~';
function updatePrompt() {
    promptElement.textContent = ` ${currentPath} ➤ `;
}
function handleCommand(command) {
    const commandOutput = document.createElement('div');
    commandOutput.innerHTML = `<span style="color: #a9b1d6;"> ${currentPath} ➤ </span>${command}`;
    output.appendChild(commandOutput);
    const commandTrimmed = command.trim();
    const firstSpaceIndex = commandTrimmed.indexOf(' ');
    let cmd;
    let argsString;
    if (firstSpaceIndex === -1) {
        cmd = commandTrimmed;
        argsString = '';
    }
    else {
        cmd = commandTrimmed.substring(0, firstSpaceIndex);
        argsString = commandTrimmed.substring(firstSpaceIndex + 1);
    }
    const parsedArgs = (0, utils_1.parseArgs)(argsString);
    if (cmd) {
        // We will dynamically fetch and execute commands from the 'scripts' folder.
        // This is just a placeholder for now.
        const result = document.createElement('div');
        result.textContent = `Executing ${cmd} with args: ${parsedArgs.raw}`;
        output.appendChild(result);
    }
    terminal.scrollTop = terminal.scrollHeight;
}
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value;
        input.value = '';
        handleCommand(command);
        updatePrompt();
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
updatePrompt();
showWelcomeMessage();
