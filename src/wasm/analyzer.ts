export type AnalysisResult = { htmlNodes: number; cssRules: number; bytes: number; warnings: string[] };
export function analyzeText(source: string): AnalysisResult { return { htmlNodes: (source.match(/<[^!/][^>]*>/g) || []).length, cssRules: (source.match(/[^{}]+\{[^{}]*\}/g) || []).length, bytes: new TextEncoder().encode(source).length, warnings: [] }; }
