document.getElementById('open').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.windows.create({
    url: chrome.runtime.getURL(`devtools.html?tabId=${tab.id}`),
    type: 'popup',
    width: 1200,
    height: 800
  });
  window.close();
});
