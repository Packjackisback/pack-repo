import { parseArgs } from './utils';

describe('parseArgs', () => {
  test('normal arguments', () => {
    const { normal, flags, raw } = parseArgs('arg1 arg2 arg3');
    expect(normal).toEqual(['arg1', 'arg2', 'arg3']);
    expect(flags).toEqual([]);
    expect(raw).toBe('arg1 arg2 arg3');
  });

  test('arguments with flags', () => {
    const { normal, flags, raw } = parseArgs('-a -b --long-flag');
    expect(normal).toEqual([]);
    expect(flags).toEqual(['-a', '-b', '--long-flag']);
    expect(raw).toBe('-a -b --long-flag');
  });

  test('mixed normal and flag arguments', () => {
    const { normal, flags, raw } = parseArgs('arg1 -a arg2 --long-flag');
    expect(normal).toEqual(['arg1', 'arg2']);
    expect(flags).toEqual(['-a', '--long-flag']);
    expect(raw).toBe('arg1 -a arg2 --long-flag');
  });

  test('single quoted arguments', () => {
    const { normal, flags, raw } = parseArgs("'hello world' arg2");
    expect(normal).toEqual(['hello world', 'arg2']);
    expect(flags).toEqual([]);
    expect(raw).toBe("'hello world' arg2");
  });

  test('double quoted arguments', () => {
    const { normal, flags, raw } = parseArgs('"hello world" arg2');
    expect(normal).toEqual(['hello world', 'arg2']);
    expect(flags).toEqual([]);
    expect(raw).toBe('"hello world" arg2');
  });

  test('mixed quoted and normal arguments', () => {
    const { normal, flags, raw } = parseArgs("arg1 'hello world' arg2 \"another quote\"");
    expect(normal).toEqual(['arg1', 'hello world', 'arg2', 'another quote']);
    expect(flags).toEqual([]);
    expect(raw).toBe("arg1 'hello world' arg2 \"another quote\"");
  });

  test('empty string', () => {
    const { normal, flags, raw } = parseArgs('');
    expect(normal).toEqual([]);
    expect(flags).toEqual([]);
    expect(raw).toBe('');
  });
}); 