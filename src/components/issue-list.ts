export type IssueItem = { severity: string; message: string };
export function renderIssues(host: HTMLElement, issues: IssueItem[]) { host.replaceChildren(...issues.map(issue => { const li = document.createElement("li"); li.textContent = `${issue.severity}: ${issue.message}`; return li; })); }
