/* The same final-CTA entry timing on the two secondary pages. */
(() => {
 'use strict';
 if(document.querySelector('.assurance') || !window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 gsap.registerPlugin(ScrollTrigger);
 const cta=document.querySelector('.contact-layout');
 if(cta) gsap.from(cta,{y:20,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:cta.closest('.contact'),start:'top 90%',once:true}});
 if(document.fonts) document.fonts.ready.then(()=>ScrollTrigger.refresh());
})();
