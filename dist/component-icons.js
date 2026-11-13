/*
 * AnimateIcons Move Right (Lucide) and Check (Hugeicons).
 * SVG paths and animation definitions by Avijit Dey (@avijit07x).
 * Source: https://github.com/Avijit07x/animateicons
 * SPDX-License-Identifier: MIT
 *
 * Copyright (c) Avijit Dey
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Native Web Animations port for the existing buildless site. The supplied
 * paths, offsets, duration, scale, stroke reveal and easing are preserved.
 */
(() => {
  'use strict';
  const arrow = document.querySelector('.comparison-arrow');
  const check = document.querySelector('.service-check');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easing = 'cubic-bezier(0.42, 0, 0.58, 1)';

  // Preserve the screenshot's corner-to-height proportion at every button size.
  const actions = document.querySelectorAll('.header-phone, .hero .button, .contact .button');
  const fitCorners = element => element.style.setProperty(
    '--photo-action-radius', element.getBoundingClientRect().height * 24 / 132 + 'px'
  );
  const actionResize = new ResizeObserver(entries => entries.forEach(entry => fitCorners(entry.target)));
  actions.forEach(action => {
    fitCorners(action);
    actionResize.observe(action);
  });

  function stop(element) {
    if (!element) return;
    element.querySelectorAll('path, circle').forEach(path => {
      path.getAnimations().forEach(animation => animation.cancel());
    });
    element.dataset.iconState = 'normal';
  }

  function track(element, animations) {
    const run = String(Number(element.dataset.iconRuns || 0) + 1);
    element.dataset.iconRuns = run;
    element.dataset.iconState = 'running';
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (element.dataset.iconRuns === run && element.dataset.iconState === 'running') {
        element.dataset.iconState = 'complete';
      }
    }, () => {});
  }

  function playArrow() {
    stop(arrow);
    if (!arrow || reduced.matches) return;
    const animations = Array.from(arrow.querySelectorAll('path'), path => path.animate([
      { transform: 'translateX(0px)', offset: 0, easing },
      { transform: 'translateX(-2px)', offset: .25, easing },
      { transform: 'translateX(2px)', offset: .6, easing },
      { transform: 'translateX(0px)', offset: 1 }
    ], { duration: 1000, easing: 'linear', fill: 'forwards' }));
    track(arrow, animations);
  }

  function playCheck() {
    stop(check);
    if (!check || reduced.matches) return;
    check.dataset.checkRevealed = 'true';
    const path = check.querySelector('path');
    const circle = check.querySelector('.check-circle');
    const reveal = path.animate([
      { strokeDashoffset: '24px', opacity: .5 },
      { strokeDashoffset: '0px', opacity: 1 }
    ], { duration: 600, easing, fill: 'forwards' });
    const scale = path.animate([
      { transform: 'scale(1)', offset: 0, easing },
      { transform: 'scale(1.15)', offset: .5, easing },
      { transform: 'scale(1)', offset: 1 }
    ], { duration: 600, easing: 'linear', fill: 'forwards' });
    // SVG circles travel clockwise; rotation puts the starting green point at 12 o'clock.
    const ring = circle.animate([
      { strokeDashoffset: '.9999' },
      { strokeDashoffset: '0' }
    ], { duration: 600, easing, fill: 'forwards' });
    const animations = [reveal, scale, ring];
    const start = document.timeline.currentTime;
    animations.forEach(animation => { animation.startTime = start; });
    track(check, animations);
  }

  [[arrow, playArrow], [check, playCheck]].forEach(([element, play]) => {
    if (!element) return;
    element.addEventListener('mouseenter', play);
    element.addEventListener('mouseleave', () => stop(element));
  });

  // Preserve the arrow's entry trigger.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target === arrow) playArrow();
      } else stop(entry.target);
    });
  }, { threshold: .01 });
  if (arrow) observer.observe(arrow);

  // Start the same check animation as hover when the green card has arrived,
  // rather than letting it finish while only one corner is entering the stage.
  let checkObserver;
  function observeCheck() {
    if (!check) return;
    checkObserver?.disconnect();
    const card = check.closest('.service-card');
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    const availableHeight = window.innerHeight - headerHeight;
    const threshold = Math.min(.85, Math.max(.15, availableHeight * .65 / card.offsetHeight));
    checkObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) playCheck();
        else if (!entry.isIntersecting) stop(check);
      });
    }, { threshold: [0, threshold] });
    checkObserver.observe(card);
  }
  const observeAfterLayout = () => requestAnimationFrame(observeCheck);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(observeAfterLayout);
  else observeAfterLayout();
  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(observeCheck);
  });

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stop(arrow);
      stop(check);
    }
  });
})();
