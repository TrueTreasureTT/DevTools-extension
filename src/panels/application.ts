export function applicationInfo() { return { url: location.href, title: document.title, storage: { local: localStorage.length, session: sessionStorage.length } }; }
