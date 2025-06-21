import { TerminalIO, Command, Argument, CommandContext, CommandResult } from '../types';

/**
 * A mock implementation of TerminalIO for testing commands.
 */
export class MockTerminalIO implements TerminalIO {
    private outputBuffer: string[] = [];
    private inputBuffer: string[] = [];
    private inputIndex = 0;

    /**
     * Provides a list of inputs to be returned by the read() method.
     * @param inputs The array of strings to use as user input.
     */
    setInput(inputs: string[]): void {
        this.inputBuffer = inputs;
        this.inputIndex = 0;
    }

    /**
     * Retrieves all output written since the last clear.
     * @returns The concatenated output string.
     */
    getOutput(): string {
        return this.outputBuffer.join('');
    }

    /**
     * Clears the internal output buffer.
     */
    clearOutput(): void {
        this.outputBuffer = [];
    }

    // --- TerminalIO implementation ---

    write(data: string): void {
        this.outputBuffer.push(data);
    }

    read(prompt?: string): Promise<string> {
        if (this.inputIndex >= this.inputBuffer.length) {
            return Promise.reject(new Error('No more input available for read()'));
        }
        if (prompt) {
            this.write(prompt);
        }
        const value = this.inputBuffer[this.inputIndex++];
        this.write(value + '\n'); // Emulate user typing and pressing enter
        return Promise.resolve(value);
    }
}

interface TestCommandResult {
    output: string;
    finalPath: string;
}

/**
 * Executes a command with a mock I/O interface for testing.
 *
 * @param command The command to execute.
 * @param args The arguments for the command.
 * @param options Options for the test run, including initial path and scripted input.
 * @returns A promise that resolves with the command's output and final state.
 */
export async function runCommand(
    command: Command,
    args: Argument,
    options: { initialPath?: string; inputs?: string[] } = {}
): Promise<TestCommandResult> {
    const mockIO = new MockTerminalIO();
    if (options.inputs) {
        mockIO.setInput(options.inputs);
    }

    const context: CommandContext = {
        currentPath: options.initialPath || '/home/user',
    };

    const result: CommandResult = await command.execute(mockIO, context, args);

    return {
        output: mockIO.getOutput(),
        finalPath: result?.newPath || context.currentPath,
    };
} 