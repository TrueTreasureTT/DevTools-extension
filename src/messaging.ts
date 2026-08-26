export type Message = {
  type: string;
  tabId?: number;
  index?: number;
  enabled?: boolean;
  name?: string;
  payload?: unknown;
};

export function send<T = unknown>(
  type: string,
  payload?: unknown,
  extra: Omit<Message, "type" | "payload"> = {}
): Promise<T> {
  return new Promise((resolve, reject) =>
    chrome.runtime.sendMessage(
      { type, payload, ...extra },
      (response) => {
        const error = chrome.runtime.lastError;
        if (error) reject(new Error(error.message));
        else resolve(response as T);
      }
    )
  );
}

export function onMessage(
  handler: (
    message: Message,
    sender: chrome.runtime.MessageSender
  ) => unknown
) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    Promise.resolve(handler(message as Message, sender))
      .then(sendResponse)
      .catch(() => sendResponse(undefined));
    return true;
  });
}
