export type NetworkEntry = { url: string; method: string; status?: number; started: number };
const entries: NetworkEntry[] = [];
export function record(entry: NetworkEntry) { entries.push(entry); if (entries.length > 500) entries.shift(); }
export function list() { return [...entries]; }
