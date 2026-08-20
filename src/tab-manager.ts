export async function activeTab() { return (await chrome.tabs.query({ active: true, currentWindow: true }))[0] ?? null; }
export async function tabUrl(tabId: number) { return (await chrome.tabs.get(tabId)).url ?? ""; }
