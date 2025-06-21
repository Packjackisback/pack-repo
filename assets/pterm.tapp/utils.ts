import { Argument } from './types';

export function parseArgs(rawArgs: string): Argument {
  const normal: string[] = [];
  const flags: string[] = [];

  const regex = /([^\s"']+|"([^"]*)"|'([^']*)')/g;
  const tokens = (rawArgs.match(regex) || []).map(token => {
    if (token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    }
    if (token.startsWith("'") && token.endsWith("'")) {
      return token.slice(1, -1);
    }
    return token;
  });

  for (const token of tokens) {
    if (token.startsWith('-')) {
      flags.push(token);
    } else {
      normal.push(token);
    }
  }

  return { normal, flags, raw: rawArgs };
} 