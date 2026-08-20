export const consoleBuffer: { level: string; args: unknown[] }[] = [];
export function log(level: string, ...args: unknown[]) { consoleBuffer.push({ level, args }); if (consoleBuffer.length > 500) consoleBuffer.shift(); }
