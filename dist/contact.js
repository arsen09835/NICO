/* Gmail-only contact routing; visible site content is unchanged. */
(() => {
 'use strict';
 const recipient='nicholaslisoni7@gmail.com';
 const encoded=encodeURIComponent(recipient);
 const web='https://mail.google.com/mail/?view=cm&fs=1&to='+encoded;
 const ios=/iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
 const android=/Android/i.test(navigator.userAgent);
 const app=android
  ? 'intent:'+recipient+'#Intent;scheme=mailto;action=android.intent.action.SENDTO;package=com.google.android.gm;S.browser_fallback_url='+encodeURIComponent(web)+';end'
  : 'googlegmail:///co?to='+encoded;
 document.querySelectorAll('a[href^="mailto:"],a[href^="https://mail.google.com/mail/"]').forEach(link=>{
  link.href=(ios || android) ? app : web;
  link.rel='noopener noreferrer';
  if(ios || android) link.removeAttribute('target');
  else link.target='_blank';
  if(!ios) return;
  link.addEventListener('click',event=>{
   if(event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   // The user click opens Gmail; only the web fallback is deferred.
   const stop=()=>{
    window.clearTimeout(timer);
    document.removeEventListener('visibilitychange',hidden);
    window.removeEventListener('pagehide',stop);
   };
   const hidden=()=>{if(document.visibilityState==='hidden') stop();};
   const timer=window.setTimeout(()=>{
    stop();
    if(document.visibilityState!=='hidden') window.location.assign(web);
   },1800);
   document.addEventListener('visibilitychange',hidden);
   window.addEventListener('pagehide',stop);
  });
 });
})();
