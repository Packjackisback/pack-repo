/**
 * Represents a parsed command argument, separating normal inputs from flags.
 */
export interface Argument {
  /** An array of normal arguments (not flags). */
  normal: string[];
  /** An array of flags, which are arguments starting with - or --. */
  flags: string[];
  /** The raw, unprocessed string of arguments. */
  raw: string;
}

/**
 * Defines the execution context for a command, providing access to terminal state.
 */
export interface CommandContext {
  /** The current working directory. */
  currentPath: string;
}

/**
 * Provides methods for a command to interact with the terminal for I/O.
 */
export interface TerminalIO {
  /** Writes data to the terminal. Does not append a newline. */
  write: (data: string) => void;
  /** Reads a line of input from the user, resolving when they press Enter. */
  read: (prompt?: string) => Promise<string>;
}

/**
 * Represents the result of a command execution.
 */
export type CommandResult = {
  newPath?: string;
} | void;

/**
 * Defines a command option (flag).
 */
export interface CommandOption {
    /** The name of the flag, e.g., 'help'. */
    name: string;
    /** A short alias for the flag, e.g., 'h'. */
    alias?: string;
    /** A description of what the flag does. */
    description: string;
}

/**
 * Defines the structure for a terminal command.
 */
export interface Command {
  /** The name of the command, used to invoke it. */
  name: string;
  /** A brief description of what the command does, for use in `help` commands. */
  description: string;
  /** An optional, more detailed usage string for the command. */
  usage?: string;
  /** An optional list of options (flags) that the command accepts. */
  options?: CommandOption[];
  /**
   * The function to execute when the command is called.
   * @param io The I/O interface for interacting with the terminal.
   * @param context The current terminal context.
   * @param args The parsed arguments for the command.
   * @returns A promise that resolves when the command is finished.
   */
  execute: (io: TerminalIO, context: CommandContext, args: Argument) => Promise<CommandResult>;
} 