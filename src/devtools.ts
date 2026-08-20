import { send } from "./messaging";
export async function inspectTab(tabId: number) { return send("page-info", tabId); }
export function getTabId() { return Number(new URLSearchParams(location.search).get("tabId")); }
