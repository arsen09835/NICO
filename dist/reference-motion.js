/* Motion adapted from the supplied PieterKoopt page source.
 * Keep native scrolling: ScrollTrigger pins the card stage while the page's
 * scroll distance drives each circular reveal. No wheel/touch interception.
 */
(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const section = document.querySelector('.assurance');
  const track = document.querySelector('.comparison-track');
  const panel = document.querySelector('.comparison-panel');
  const grid = document.querySelector('.service-grid');
  const cards = Array.from(document.querySelectorAll('.service-card'));
  const contact = document.querySelector('.contact-layout');
  const header = document.querySelector('.site-header');
  if (!section || !track || !panel || cards.length !== 3) return;

  // Keep the two original cards at their existing size and give the positive
  // card 20% more room, without scaling its text or the check a second time.
  const fitCardSizes = () => {
    section.style.removeProperty('--comparison-card-height');
    const base = Math.ceil(Math.max(cards[0].offsetHeight, cards[1].offsetHeight, cards[2].offsetHeight / 1.2));
    section.style.setProperty('--comparison-card-height', base + 'px');
  };

  const media = gsap.matchMedia();
  const setup = () => {
    media.add({
      desktop: '(min-width: 992px) and (min-height: 650px)',
      motion: '(prefers-reduced-motion: no-preference)'
    }, context => {
      if (!context.conditions.motion) {
        fitCardSizes();
        return () => section.style.removeProperty('--comparison-card-height');
      }
      const pinTop = () => header.getBoundingClientRect().height + 24;
      const availableHeight = () => window.innerHeight - pinTop() - 24;
      const circles = [];
      let pinned = false;

      if (context.conditions.desktop) {
        section.classList.add('cards-motion');
        section.style.setProperty('--comparison-height', availableHeight() + 'px');
        cards.forEach(card => {
          const circle = document.createElement('div');
          circle.className = 'uc-circle';
          grid.insertBefore(circle, card);
          circle.appendChild(card);
          circles.push(circle);
        });
        fitCardSizes();
        const cardHeight = Math.ceil(Math.max(...cards.map(card => card.offsetHeight)));
        if (cardHeight + 48 <= availableHeight()) {
          pinned = true;

          // Source: .pin-height = 400vh; one viewport of scroll per card.
          gsap.fromTo(grid, { y: '0%' }, {
            y: '0%', ease: 'none',
            scrollTrigger: {
              id: 'nicola-comparison-pin', trigger: track,
              start: () => 'top ' + pinTop(),
              end: () => '+=' + window.innerHeight * cards.length,
              pin: panel, pinSpacing: true, scrub: true,
              anticipatePin: 1, invalidateOnRefresh: true,
              onRefresh: () => section.style.setProperty('--comparison-height', availableHeight() + 'px')
            }
          });
          let angle = -((cards.length - 1) * 3 / 2);
          circles.forEach((circle, index) => {
            const scroll = {
              trigger: track,
              start: () => 'top ' + (pinTop() - window.innerHeight * index),
              end: () => '+=' + window.innerHeight,
              scrub: true, invalidateOnRefresh: true
            };
            // Same rotation, lift, ease and sequence as the supplied reference.
            gsap.to(circle, { rotation: angle, ease: 'power1.out', scrollTrigger: { ...scroll } });
            gsap.to(cards[index], {
              rotation: angle, y: '-50%', ease: 'power1.out',
              scrollTrigger: { ...scroll }
            });
            angle += 3;
          });
        } else {
          circles.forEach(circle => circle.replaceWith(circle.firstElementChild));
          circles.length = 0;
          section.classList.remove('cards-motion');
          section.style.removeProperty('--comparison-height');
        }
      }

      if (!pinned) {
        fitCardSizes();
        // The reference releases pinning below 992px. Preserve that reading
        // room, with sequential entry using its non-split reveal timing.
        cards.forEach(card => gsap.from(card, {
          y: 20, opacity: 0, duration: .7, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true }
        }));
      }

      gsap.from(contact, {
        y: 20, opacity: 0, duration: .7, ease: 'power2.out',
        scrollTrigger: { trigger: document.querySelector('.contact'), start: 'top 90%', once: true }
      });

      return () => {
        circles.forEach(circle => { if (circle.firstElementChild) circle.replaceWith(circle.firstElementChild); });
        section.classList.remove('cards-motion');
        section.style.removeProperty('--comparison-height');
        section.style.removeProperty('--comparison-card-height');
      };
    });
    ScrollTrigger.refresh();
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup);
  else setup();
})();
