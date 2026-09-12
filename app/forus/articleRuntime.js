// The supplied article's demos run only inside their mounted article. All work
// that can outlive the DOM is owned here and stopped when navigating away.
export function initializeArticle(root) {
  let disposed = false;
  const controller = new AbortController();
  const timers = new Set();
  const intervals = new Set();
  const frames = new Set();
  const observers = new Set();
  const addEventListener = (type, listener, options = {}) => window.addEventListener(type, listener, { ...options, signal: controller.signal });
  const document = {
    querySelector: (selector) => root.querySelector(selector),
    getElementById: (id) => root.querySelector(`#${CSS.escape(id)}`),
    createElement: (tag) => window.document.createElement(tag),
    get hidden() { return window.document.hidden; },
    documentElement: window.document.documentElement,
    addEventListener: (type, listener, options = {}) => window.document.addEventListener(type, listener, { ...options, signal: controller.signal }),
  };
  const matchMedia = (query) => {
    const media = window.matchMedia(query);
    return {
      get matches() { return media.matches; },
      addEventListener: (type, listener) => media.addEventListener(type, listener, { signal: controller.signal }),
    };
  };
  const setTimeout = (callback, delay) => {
    if (disposed) return 0;
    const id = window.setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, delay);
    timers.add(id);
    return id;
  };
  const clearTimeout = (id) => { timers.delete(id); window.clearTimeout(id); };
  const setInterval = (callback, delay) => {
    if (disposed) return 0;
    const id = window.setInterval(() => { if (!disposed) callback(); }, delay);
    intervals.add(id);
    return id;
  };
  const clearInterval = (id) => { intervals.delete(id); window.clearInterval(id); };
  const requestAnimationFrame = (callback) => {
    if (disposed) return 0;
    const id = window.requestAnimationFrame((time) => { frames.delete(id); if (!disposed) callback(time); });
    frames.add(id);
    return id;
  };
  const cancelAnimationFrame = (id) => { frames.delete(id); window.cancelAnimationFrame(id); };
  class IntersectionObserver extends window.IntersectionObserver {
    constructor(callback, options) {
      super((entries, observer) => { if (!disposed) callback(entries, observer); }, options);
      observers.add(this);
    }
  }

  // Section links update the shareable hash without adding fake page-history
  // entries, so Back still returns to the project card that opened the article.
  root.querySelector('.blog-toc').addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, '', link.hash);
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, { signal: controller.signal });

  // Original interactive demos, with local DOM and lifecycle adapters above.
(() => {
  const scope=document.querySelector('#figure-4 .diag-wrap');
  const approve=document.getElementById('approve'),reject=document.getElementById('reject'),restart=document.getElementById('restart');
  const proposal=document.getElementById('proposal'),label=document.getElementById('action-label'),status=document.getElementById('demo-status');
  const browser=document.getElementById('browser-content'),proposedCode=document.getElementById('proposed-code');
  const approvalBox=scope.querySelector('.approval');
  function ehrIcon(name) {
    const paths={"overview": "M2 2h8v8H2z M14 2h8v8h-8z M2 14h8v8H2z M14 14h8v8h-8z", "patients": "M12 2a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M3 22v-3a9 6 0 0 1 18 0v3z", "schedule": "M3 4h3V1h2v3h8V1h2v3h3v19H3z M5 9h14v2H5z M7 14h3v3H7z M14 14h3v3h-3z", "inbox": "M3 2h18v20H3z M5 6v8h4l2 3h2l2-3h4V6z", "settings": "M2 5h20v2H2z M2 11h20v2H2z M2 17h20v2H2z M5 2h4v8H5z M15 8h4v8h-4z M8 14h4v8H8z", "search": "M10 1a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M10 4a6 6 0 1 0 0 12a6 6 0 1 0 0-12z M17 15l7 7-2 2-7-7z", "chevron": "M7 3l10 9L7 21l-2-3 7-6-7-6z", "file": "M5 2h9l5 5v15H5z M13 3v6h5z M8 12h8v2H8z M8 16h6v2H8z", "cross": "M8 1h8v7h7v8h-7v7H8v-7H1V8h7z"};
    return `<svg class="ehr-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="${paths[name]}"/></svg>`;
  }
  let selectedPatient=0, currentScreen='home', openedLab=-1, manualNavigation=false;
  const people=['Lewis Hamilton','Max Verstappen','Charles Leclerc','Lando Norris'];
  const initials=['LH','MV','CL','LN'];
  const baseLabNames=['Complete Blood Count','Metabolic Panel','Hemoglobin A1c','Lipid Panel'];
  function ehrButton(action,label,cls=''){return `<button type="button" class="${cls}" data-ehr-action="${action}">${label}</button>`;}
  function renderEhr(screen) {
    currentScreen=screen;
    const home=screen==='home', chart=screen==='chart'||screen==='labs', labs=screen==='labs';
    const name=people[selectedPatient];
    const labNames=[...baseLabNames,...([0,2].includes(selectedPatient)?['Stress assessment (fictional demo)']:[])];
    let content='';
    if(home){content=`<div class="ehr-page-title">Patients <span class="ehr-count">4</span></div><label class="ehr-search">${ehrIcon('search')}<input aria-label="Search patients" placeholder="Search patients" data-ehr-search></label><div class="ehr-list-head">PATIENT NAME <span>CHART</span></div><div class="ehr-patient-list">${people.map((n,i)=>ehrButton('patient:'+i,`<span class="ehr-avatar">${initials[i]}</span><span class="ehr-record"><strong>${n}</strong><span class="ehr-record-meta">MRN ${10421+i}</span></span><span class="ehr-row-end">${ehrIcon('chevron')}</span>`,'ehr-row')).join('')}</div><p class="ehr-empty" hidden>No patients found.</p>`;}
    else if(chart){content=`<div class="ehr-breadcrumb">${ehrButton('home','Patients')} / ${name}</div><div class="ehr-patient"><span class="ehr-avatar">${initials[selectedPatient]}</span><div><strong>${name}</strong><span>MRN ${10421+selectedPatient}</span></div></div><div class="ehr-tabs">${ehrButton('chart','Summary',!labs?'ehr-active-tab':'')}${ehrButton('labs','Lab results',labs?'ehr-active-tab':(manualNavigation?'':'target pulsing'))}</div>`;
      if(labs){content+=`<div class="ehr-list-head">LAB RESULTS <span>STATUS</span></div>`+labNames.map((n,i)=>ehrButton('lab:'+i,`<span class="ehr-avatar">${ehrIcon('file')}</span><span class="ehr-record"><strong>${n}</strong><span class="ehr-record-meta">${i===4?'Self-reported assessment · fictional demo':'Laboratory report'}</span></span><span class="ehr-row-end">${i===4?'High stress':'Normal'} ${ehrIcon('chevron')}</span>`,'ehr-row')).join('');
      if(openedLab>=0){const values=[['Hemoglobin','14.2 g/dL','13.5–17.5'],['Sodium','140 mmol/L','135–145'],['Hemoglobin A1c','5.4%','4.0–5.6'],['Total cholesterol','172 mg/dL','Below 200'],['Self-reported stress',selectedPatient===0?'8 / 10':'9 / 10','Illustrative score, not a lab measurement']][openedLab];content+=`<div class="ehr-report"><div class="ehr-page-title">${labNames[openedLab]} ${ehrButton('close','×','ehr-close')}</div><div class="ehr-record-meta">${name} · ${openedLab===4?'Fictional demo · High self-reported stress':'Final result · Within reference range'}</div><dl><dt>${values[0]}</dt><dd>${values[1]}</dd><dt>${openedLab===4?'Assessment type':'Reference range'}</dt><dd>${values[2]}</dd></dl></div>`;}}
      else content+=`<div class="ehr-list-head">CHART SUMMARY</div><div class="ehr-summary"><strong>Patient Information</strong><p>${name}<br>MRN ${10421+selectedPatient}</p><strong>Recent Activity</strong><p>${labNames.length} reports available</p>${ehrButton('labs','View Lab Results','ehr-view-results')}</div>`;
    }else if(screen==='schedule'){content='<div class="ehr-page-title">Schedule</div><div class="ehr-list-head">TODAY <span>PATIENT</span></div>'+people.map((n,i)=>ehrButton('patient:'+i,`<span class="ehr-avatar">${9+i}:00</span><span class="ehr-record"><strong>${n}</strong><span class="ehr-record-meta">Follow up visit</span></span>${ehrIcon('chevron')}`,'ehr-row')).join('');}
    else if(screen==='inbox'){content='<div class="ehr-page-title">In Basket</div>'+people.map((n,i)=>ehrButton('message:'+i,`<span class="ehr-avatar">${ehrIcon('inbox')}</span><span class="ehr-record"><strong>Lab Results Available</strong><span class="ehr-record-meta">${n}</span></span>${ehrIcon('chevron')}`,'ehr-row')).join('');}
    else if(screen==='orders'){content=`<div class="ehr-page-title">Orders</div><div class="ehr-summary"><strong>${name}</strong><p>4 completed laboratory orders</p>${ehrButton('labs','Review Results','ehr-view-results')}</div>`;}
    else{content='<div class="ehr-page-title">Settings</div><label class="ehr-setting"><input type="checkbox" data-ehr-compact> Compact chart rows</label>';}
    return `<div class="ehr-app"><div class="ehr-ribbon">${[['home','Home'],['schedule','Schedule'],['inbox','In Basket'],['chart','Chart'],['orders','Orders']].map(([v,l])=>ehrButton(v,l,screen===v?'ehr-ribbon-active':'')).join('')}</div><div class="ehr-layout"><aside class="ehr-sidebar">${[['chart','overview','Chart Review'],['home','patients','Patients'],['schedule','schedule','Schedule'],['inbox','inbox','In Basket'],['settings','settings','Settings']].map(([v,ic,l])=>ehrButton(v,ehrIcon(ic)+`<span>${l}</span>`,'ehr-nav '+(v===screen?'ehr-selected ':'')+(v==='home'&&home&&!manualNavigation?'target pulsing':'')+(v==='settings'?' ehr-settings':''))).join('')}</aside><section class="ehr-main">${content}</section></div></div>`;
  }
  browser.innerHTML=renderEhr('home');
  let step=0,busy=false,timer=null,lines=[],amendedAction=null;
  const steps=[
    {name:'Click Patients',target:'.ehr-sidebar [data-ehr-action="home"]',screen:'home',message:'I’ll click Patients to open the patient list.',code:'await page.get_by_role("button", name="Patients", exact=True).click()'},
    {name:'Open Lewis Hamilton',target:'[data-ehr-action="patient:0"]',screen:'chart',message:'I found Lewis Hamilton. I’ll open his chart.',code:'await page.get_by_role("button", name="Lewis Hamilton MRN 10421").click()'},
    {name:'Click Lab results',target:'.ehr-tabs [data-ehr-action="labs"]',screen:'labs',message:'His chart is open. I’ll click Lab results to view the reports.',code:'await page.get_by_role("button", name="Lab results", exact=True).click()'}
  ];
  function clearTargets(){browser.querySelectorAll('.target,.pulsing').forEach(el=>el.classList.remove('target','pulsing'));}
  function propose(){
    const action=amendedAction||steps[step];clearTargets();
    const target=browser.querySelector(action.target);if(target)target.classList.add('target','pulsing');
    proposal.textContent=action.message;label.textContent=action.name;proposedCode.textContent=action.code;
    approvalBox.hidden=false;approve.disabled=false;reject.disabled=false;
    status.textContent='Waiting for your approval.';
  }
  function reset(){
    clearTimeout(timer);manualNavigation=false;selectedPatient=0;currentScreen='home';openedLab=-1;
    step=0;busy=false;lines=[];amendedAction=null;browser.innerHTML=renderEhr('home');restart.hidden=true;selectChoice(approve);propose();
  }
  approve.addEventListener('click',()=>{
    if(busy||manualNavigation||step>=steps.length)return;
    busy=true;approve.disabled=true;reject.disabled=true;clearTargets();
    const action=amendedAction||steps[step];status.textContent='Running: '+action.name+'…';
    timer=setTimeout(()=>{
      browser.innerHTML=renderEhr(action.screen);clearTargets();lines.push(action.code);amendedAction=null;step=steps.indexOf(action)+1;busy=false;restart.hidden=false;
      if(step<steps.length){propose();}
      else{approvalBox.hidden=true;proposal.textContent='The lab results are open. You can click a report to explore it.';status.textContent='Done. Every browser action ran after your approval.';}
    },350);
  });
  reject.addEventListener('click',()=>{
    if(busy)return;clearTargets();approvalBox.hidden=true;restart.hidden=false;
    proposal.textContent='Okay, I won’t do that. You can explore the EHR yourself or start again.';
    status.textContent='Action rejected. Nothing changed in the browser.';
  });
  function takeManualControl(){
    manualNavigation=true;clearTargets();clearTimeout(timer);busy=false;approvalBox.hidden=true;restart.hidden=false;
    proposal.textContent='You’re in control. I’ll pause while you explore.';
    status.textContent='Start again to return to the guided workflow.';
  }
  let selectedChoice=approve;
  function selectChoice(button){selectedChoice=button;[approve,reject].forEach(item=>item.classList.toggle('selected-choice',item===button));}
  selectChoice(approve);
  [approve,reject].forEach(button=>{button.addEventListener('focus',()=>selectChoice(button));button.parentElement.addEventListener('pointerenter',()=>{if(!button.disabled)selectChoice(button);});});
  const agentPane=scope.querySelector('.agent-pane');
  document.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.repeat||event.isComposing||approvalBox.hidden||busy)return;
    const target=event.target;
    if(!(target instanceof Element)||target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return;
    // Let other links, controls, and the EHR keep their native keyboard behavior.
    if(target!==approve&&target!==reject&&target.closest('a,button,[role="button"],[tabindex]')!==agentPane&&target!==root&&target!==window.document.body&&target!==window.document.documentElement)return;
    const bounds=approvalBox.querySelector('.buttons').getBoundingClientRect();
    if(bounds.bottom<=0||bounds.top>=window.innerHeight||bounds.right<=0||bounds.left>=window.innerWidth)return;
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();selectChoice(selectedChoice===approve?reject:approve);selectedChoice.focus();return;}
    if(event.key==='Enter'){event.preventDefault();selectedChoice.click();return;}
    const choice={'1':approve,'2':reject,'Escape':reject}[event.key];if(choice){event.preventDefault();choice.click();}
  });
  reset();
  browser.addEventListener('pointerdown',takeManualControl);
  browser.addEventListener('keydown',event=>{if(['Enter',' ','ArrowDown','ArrowUp'].includes(event.key))takeManualControl();});
  browser.addEventListener('click',event=>{
    const button=event.target.closest('[data-ehr-action]');if(!button)return;
    takeManualControl();
    const action=button.dataset.ehrAction;let next=action;
    if(action.startsWith('patient:')){selectedPatient=Number(action.split(':')[1]);openedLab=-1;next='chart';}
    else if(action.startsWith('message:')){selectedPatient=Number(action.split(':')[1]);openedLab=-1;next='labs';}
    else if(action.startsWith('lab:')){openedLab=Number(action.split(':')[1]);next='labs';}
    else if(action==='close'){openedLab=-1;next='labs';}
    else openedLab=-1;
    browser.innerHTML=renderEhr(next);
    browser.querySelectorAll('.pulsing').forEach(e=>e.classList.remove('pulsing'));
    const focusTarget=browser.querySelector('.ehr-main button, .ehr-main input');
    if(focusTarget)focusTarget.focus({preventScroll:true});
  });
  browser.addEventListener('input',event=>{
    if(!event.target.matches('[data-ehr-search]'))return;
    takeManualControl();
    const query=event.target.value.trim().toLowerCase();let visible=0;
    browser.querySelectorAll('.ehr-patient-list .ehr-row').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(query);if(!row.hidden)visible++;});
    browser.querySelector('.ehr-empty').hidden=visible>0;
  });
  browser.addEventListener('change',event=>{if(event.target.matches('[data-ehr-compact]')){browser.classList.toggle('ehr-compact',event.target.checked);}});
  restart.addEventListener('click',reset);
})();





(()=>{const fig=document.getElementById('figure-3');let timer=null,step=0;const play=fig.querySelector('.flow-play');
function stop(){clearInterval(timer);timer=null;play.textContent='▶';play.setAttribute('aria-label','Play the authoring sequence')}
function show(n){step=n;fig.dataset.phase=n;fig.querySelectorAll('.flow-node').forEach(el=>{const active=Number(el.dataset.step)===n||(n===1&&el.dataset.step==='3')||(n===3&&el.dataset.step==='1');el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',active)});fig.querySelectorAll('.flow-step').forEach(el=>el.setAttribute('aria-pressed',Number(el.dataset.step)===n));fig.querySelectorAll('[data-phase]').forEach(el=>el.classList.toggle('is-active',Number(el.dataset.phase)===n))}
fig.querySelectorAll('[data-step]').forEach(el=>{el.addEventListener('click',()=>{stop();show(Number(el.dataset.step))});if(el.tagName.toLowerCase()==='g')el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stop();show(Number(el.dataset.step))}})});
function start(){stop();show(1);play.textContent='Ⅱ';play.setAttribute('aria-label','Pause the authoring sequence');timer=setInterval(()=>{if(step===4){stop();return}show(step+1)},2000)}
play.addEventListener('click',()=>{if(timer)stop();else start()});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches){if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){start();observer.disconnect()}},{threshold:.4});observer.observe(fig);fig.addEventListener('pointerdown',()=>observer.disconnect(),{once:true});fig.addEventListener('keydown',()=>observer.disconnect(),{once:true});}else start();}
})();



(()=>{const el=document.getElementById('recovery-comparison');if(!el)return;const replay=el.querySelector('.replay-clocks');let raf;const duration=7600,earlyFinish=1200,full=28800;const clocks=[...el.querySelectorAll('.recovery-clock')];const times=[25980,281];const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Both dials follow one accelerated elapsed-time timeline. Each stops at its measured duration.
function draw(elapsed){clocks.forEach((clock,i)=>{const seconds=Math.min(times[i],elapsed);clock.querySelector('.clock-arc').style.strokeDasharray=(seconds/full*100)+' 100';clock.querySelector('.clock-hand').style.transform='rotate('+(seconds/full*360)+'deg)';const n=Math.floor(seconds);clock.querySelector('.clock-value').textContent=i===0?Math.floor(n/3600)+'h '+Math.floor(n%3600/60)+'m':Math.floor(n/60)+'m '+(n%60)+'s';clock.classList.toggle('clock-complete',seconds>=times[i])})}
function play(){cancelAnimationFrame(raf);replay.hidden=true;if(reduced.matches){draw(times[0]);replay.hidden=false;return}draw(0);const start=performance.now();function frame(now){const ms=Math.min(duration,now-start);const elapsed=ms<=earlyFinish?times[1]*ms/earlyFinish:times[1]+(times[0]-times[1])*(ms-earlyFinish)/(duration-earlyFinish);draw(elapsed);if(ms<duration)raf=requestAnimationFrame(frame);else replay.hidden=false}raf=requestAnimationFrame(frame)}
replay.addEventListener('click',play);
if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){play();obs.disconnect()}},{threshold:.4});obs.observe(el)}else{draw(times[0]);replay.hidden=false}
})();



(()=>{
const fig=document.getElementById('reset-screen-examples');if(!fig)return;
const panel=fig.querySelector('.reset-preview-browser'),fields=[...fig.querySelectorAll('.reset-preview-field .reset-preview-input')],captcha=fig.querySelector('.reset-captcha-entry .reset-preview-input'),save=fig.querySelector('.reset-preview-toolbar>span');
const cursor=document.createElement('div');cursor.className='reset-demo-cursor';cursor.hidden=true;cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<svg viewBox="0 0 22 27"><path d="M2 2L20 17L11 18L6 25Z" fill="#333" stroke="#fff" stroke-width="1.5"/></svg>';panel.append(cursor);
const replay=document.createElement('button');replay.type='button';replay.className='reset-demo-replay';replay.textContent='↻';replay.setAttribute('aria-label','Replay password reset illustration');replay.hidden=true;fig.querySelector('figcaption').prepend(replay);
let running=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function move(target){const a=panel.getBoundingClientRect(),b=target.getBoundingClientRect();cursor.style.transform=`translate(${b.left-a.left+Math.min(b.width*.3,60)}px,${b.top-a.top+b.height*.55}px)`;}
async function type(target,value){move(target);await delay(550);target.classList.add('reset-typing');target.textContent='';for(const char of value){target.textContent+=char;await delay(85)}target.classList.remove('reset-typing');await delay(180);}
async function play(){if(running||reduced.matches)return;running=true;replay.hidden=true;fields.forEach(field=>field.textContent='');captcha.textContent='';cursor.hidden=false;
await type(fields[0],'••••••••••••');await type(fields[1],'••••••••••••');await type(fields[2],'••••••••••••');await type(captcha,'hw6ec');move(save);await delay(600);save.classList.add('reset-save-click');await delay(220);save.classList.remove('reset-save-click');await delay(250);cursor.hidden=true;running=false;replay.hidden=false;}
replay.addEventListener('click',play);
if(!reduced.matches){if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();play()}},{threshold:.35});observer.observe(fig);}else play();}
})();



(()=>{
const nav=document.querySelector('.blog-toc'),details=nav.querySelector('details'),links=[...nav.querySelectorAll('a')],targets=links.map(link=>document.getElementById(link.hash.slice(1))),desktop=matchMedia('(min-width:1180px)');
let queued=false;
function layout(){details.open=desktop.matches;}
layout();desktop.addEventListener('change',layout);
function update(){
  queued=false;
  let active=0;
  targets.forEach((target,i)=>{if(target.getBoundingClientRect().top<=130)active=i;});
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)active=targets.length-1;
  const changed=links[active].getAttribute('aria-current')!=='location';
  links.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  if(changed&&desktop.matches){
    const item=links[active].getBoundingClientRect(),box=nav.getBoundingClientRect();
    if(item.top<box.top+8)nav.scrollTop+=item.top-box.top-8;
    else if(item.bottom>box.bottom-8)nav.scrollTop+=item.bottom-box.bottom+8;
  }
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
links.forEach(link=>link.addEventListener('click',()=>{if(!desktop.matches)details.open=false;}));
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);update();
})();



(()=>{
const figure=document.getElementById('figure-2');
if(!figure||!figure.querySelector('.animated-chosen-lane'))return;
let visible=false;
const motion=matchMedia('(prefers-reduced-motion:reduce)');
function sync(){figure.classList.toggle('is-playing',visible&&!document.hidden&&!motion.matches);}
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.3});
observer.observe(figure);
document.addEventListener('visibilitychange',sync);
motion.addEventListener('change',sync);
})();

  return () => {
    disposed = true;
    controller.abort();
    timers.forEach((id) => window.clearTimeout(id));
    intervals.forEach((id) => window.clearInterval(id));
    frames.forEach((id) => window.cancelAnimationFrame(id));
    observers.forEach((observer) => observer.disconnect());
    root.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  };
}
