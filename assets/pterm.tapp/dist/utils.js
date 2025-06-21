"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = parseArgs;
function parseArgs(rawArgs) {
    const normal = [];
    const flags = [];
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
        }
        else {
            normal.push(token);
        }
    }
    return { normal, flags, raw: rawArgs };
}
