export type Issue = { severity: "good" | "warning"; message: string };
export function inspectDocument(doc: Document): Issue[] {
  const issues: Issue[] = [];
  issues.push({ severity: location.protocol === "https:" ? "good" : "warning", message: location.protocol === "https:" ? "HTTPS is enabled." : "HTTPS is not enabled." });
  const images = [...doc.images];
  const missingAlt = images.filter(img => !img.alt).length;
  if (missingAlt) issues.push({ severity: "warning", message: `${missingAlt} image(s) are missing alt text.` });
  else issues.push({ severity: "good", message: "Images have alt text." });
  return issues;
}
