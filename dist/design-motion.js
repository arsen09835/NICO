/* Secondary check feedback only. Reading and native scrolling never wait for motion. */
(() => {
 'use strict';
 const check=document.querySelector('.service-check');
 if(!check || typeof window.matchMedia!=='function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const path=check.querySelector('path'),circle=check.querySelector('circle');
 if(typeof IntersectionObserver==='undefined' || !path || !circle || typeof path.animate!=='function' || typeof circle.animate!=='function') return;
 const play=()=>{
  const timing={duration:600,easing:'cubic-bezier(.42,0,.58,1)',fill:'both'};
  path.animate([{strokeDashoffset:24,opacity:.5},{strokeDashoffset:0,opacity:1}],timing);
  circle.animate([{strokeDashoffset:.9999},{strokeDashoffset:0}],timing);
 };
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)) {play();observer.disconnect();}
 },{threshold:.4});
 observer.observe(check.closest('.service-card'));
 check.addEventListener('mouseenter',play);
})();
