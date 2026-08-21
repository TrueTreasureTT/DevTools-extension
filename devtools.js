const params = new URLSearchParams(location.search);
const tabId = Number(params.get('tabId'));
const tree = document.getElementById('tree');
const details = document.getElementById('details');
const page = document.getElementById('page');
const output = id => document.getElementById(id);
function show(name){document.querySelectorAll('main>section').forEach(s=>s.hidden=s.id!==name);document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));}
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));
async function send(type,payload={}){return chrome.tabs.sendMessage(tabId,{type,...payload});}
function renderNode(item,depth=0){const b=document.createElement('button');b.style.paddingLeft=`${depth*18+6}px`;b.textContent=`<${item.tag||'element'}${item.id?' #'+item.id:''}${item.classes?.length?' .'+item.classes.join('.') :''}>`;b.onclick=async()=>{details.textContent=JSON.stringify(item,null,2);try{const inspected=await send('inspect-element',{selector:item.selector});if(inspected)details.textContent=JSON.stringify(inspected,null,2);}catch(_){}};tree.appendChild(b);(item.children||[]).forEach(x=>renderNode(x,depth+1));}
async function init(){if(!Number.isInteger(tabId)){details.textContent='No target tab was supplied.';return;}try{const data=await send('inspect-page');page.textContent=data?.url||'Unknown page';tree.replaceChildren();if(data?.dom)renderNode(data.dom);else details.textContent='No DOM information was returned.';output('console-output').textContent=data?.console?.join('\n')||'No captured console messages.';output('network-output').textContent=(data?.resources||[]).map(x=>`${x.type||'resource'}: ${x.url}`).join('\n')||'No resources reported.';output('security-output').textContent=JSON.stringify(data?.security||{status:'No basic issues detected.'},null,2);const list=output('source-list');list.replaceChildren();(data?.sources||[]).forEach(x=>{const d=document.createElement('div');d.className='source';d.textContent=`${x.type}: ${x.url}`;list.appendChild(d);});}catch(e){details.textContent='Unable to inspect this page. The browser may restrict access to this URL.\n\n'+e;}}
show('elements');init();
