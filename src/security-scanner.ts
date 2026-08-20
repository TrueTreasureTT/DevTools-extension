export type Finding = { severity: "info" | "warning"; message: string; location?: string };
const secretPatterns = [/AIza[0-9A-Za-z_-]{20,}/, /sk-[A-Za-z0-9_-]{20,}/];
export function scanSource(source: string): Finding[] {
  const findings: Finding[] = [];
  if (location.protocol !== "https:" && location.hostname !== "localhost") findings.push({ severity: "warning", message: "Page is not using HTTPS." });
  if (secretPatterns.some(p => p.test(source))) findings.push({ severity: "warning", message: "Possible exposed credential pattern detected. Value is intentionally not displayed." });
  return findings;
}
