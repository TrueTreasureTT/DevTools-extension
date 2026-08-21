(() => {
  const listeners = [];
  const original = {};
  for (const level of ['log','info','warn','error']) {
    original[level] = console[level];
    console[level] = (...args) => {
      listeners.push(`[${level}] ${args.map(String).join(' ')}`);
      original[level](...args);
    };
  }
  function elementData(el){
    const r=el.getBoundingClientRect();
    const s=getComputedStyle(el);
    return {tag:el.tagName.toLowerCase(),id:el.id,classes:[...el.classList],text:(el.textContent||'').trim().slice(0,200),styles:{display:s.display,color:s.color,backgroundColor:s.backgroundColor,fontSize:s.fontSize,position:s.position,width:s.width,height:s.height,margin:s.margin,padding:s.padding},layout:{x:r.x,y:r.y,width:r.width,height:r.height},children:[...el.children].map(elementData)};
  }
  chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if(message?.type!=='inspect-page')return;
    const resources=[...document.querySelectorAll('script[src],link[href],img[src]')].map(e=>({type:e.tagName.toLowerCase(),url:e.src||e.href}));
    const mixed=location.protocol==='https:'&&resources.some(x=>x.url.startsWith('http:'));
    const security={https:location.protocol==='https:',mixedContent:mixed,credentialPattern:false,note:'Secret values are not returned by this scanner.'};
    sendResponse({url:location.href,title:document.title,dom:elementData(document.documentElement),sources:resources,resources,console:listeners,security});
    return true;
  });
})();
