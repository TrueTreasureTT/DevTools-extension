export function performanceSnapshot() { return { timeOrigin: performance.timeOrigin, now: performance.now(), memory: (performance as Performance & { memory?: unknown }).memory ?? null }; }
