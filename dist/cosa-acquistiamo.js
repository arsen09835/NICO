/* Reuse the homepage final CTA reveal with its original timing. */
(() => {
 'use strict';
 if (!window.gsap || !window.ScrollTrigger) return;
 const reveal = () => {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
   gsap.from(document.querySelector('.contact-layout'), {
    y:20, opacity:0, duration:.7, ease:'power2.out',
    scrollTrigger:{trigger:document.querySelector('.contact'),start:'top 90%',once:true}
   });
  });
  ScrollTrigger.refresh();
 };
 if (document.fonts && document.fonts.ready) document.fonts.ready.then(reveal);
 else reveal();
})();
