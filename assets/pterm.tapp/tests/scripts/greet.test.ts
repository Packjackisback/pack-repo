import greetCommand from '../../scripts/greet';
import { runCommand } from '../test-utils';
import { Argument } from '../../types';

// Mock the parseArgs function if it's not available in the test environment,
// or import it from your utils file.
const mockParseArgs = (raw: string): Argument => ({
    normal: raw.split(' ').filter(s => s),
    flags: [],
    raw: raw,
});

describe('greet command', () => {
    it('should greet the user by name', async () => {
        const args = mockParseArgs('');
        const inputs = ['Alice']; // Scripted user input for the 'read' prompt

        const { output } = await runCommand(greetCommand, args, { inputs });

        // The expected output includes the prompt and the final message.
        expect(output).toBe(
            "Hello! What is your name?\n" +
            "Name: " +
            "Alice\n" + // This includes the emulated user input
            "Nice to meet you, Alice!\n"
        );
    });

    it('should work with a different name', async () => {
        const args = mockParseArgs('');
        const inputs = ['Bob'];

        const { output } = await runCommand(greetCommand, args, { inputs });

        expect(output).toContain('Nice to meet you, Bob!');
    });
}); 