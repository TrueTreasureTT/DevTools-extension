const $ = (id) => document.getElementById(id);

async function inspect() {
  $('status').textContent = 'Inspecting…';
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab?.id) throw new Error('No active tab');
    const result = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => ({
        url: location.href,
        title: document.title || 'Untitled',
        elements: document.getElementsByTagName('*').length,
        scripts: document.scripts.length
      })
    });
    const data = result[0]?.result;
    $('url').textContent = data?.url ?? '—';
    $('title').textContent = data?.title ?? '—';
    $('elements').textContent = String(data?.elements ?? '—');
    $('scripts').textContent = String(data?.scripts ?? '—');
    $('status').textContent = 'Inspection complete';
  } catch (error) {
    $('status').textContent = error.message || 'Inspection failed';
  }
}

$('refresh').addEventListener('click', inspect);
inspect();
