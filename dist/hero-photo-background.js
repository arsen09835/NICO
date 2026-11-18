/* Photo-filled diagonal shapes, scoped to the homepage hero. */
(() => {
  'use strict';
  const hero = document.querySelector('main > #top.hero:not(.purchases-hero)');
  if (!hero) return;
  const grid = hero.querySelector('.hero-editorial');
  const copy = hero.querySelector('.hero-copy');
  const copyViewport = hero.querySelector('.hero-copy-viewport');
  const collage = hero.querySelector('.hero-collage');
  const description = hero.querySelector('.hero-description');
  const links = hero.querySelector('.hero-resource-links');
  const actions = hero.querySelector('.actions');
  if (!grid || !copy || !copyViewport || !collage || !description || !links || !actions) return;
  const linksParent = links.parentNode;
  const linksNext = links.nextSibling;
  const mobileMedia = window.matchMedia('(max-width:900px)');
  const protectedCopy = Array.from(hero.querySelectorAll('h1, .hero-description, .hero-resource-links a'));
  const ns = 'http://www.w3.org/2000/svg';
  const art = document.createElementNS(ns, 'svg');
  art.classList.add('hero-photo-background');
  art.setAttribute('aria-hidden', 'true');
  art.setAttribute('focusable', 'false');
  art.setAttribute('preserveAspectRatio', 'none');
  art.innerHTML = `<defs>
    <clipPath id="hero-photo-shapes" clipPathUnits="userSpaceOnUse"><path class="hero-photo-right"/><path class="hero-photo-left"/></clipPath>
  </defs>
  <g clip-path="url(#hero-photo-shapes)">
    <image class="hero-photo-image" href="/assets/hero-diagonal-antiquities-nov18.png" preserveAspectRatio="xMidYMid slice" opacity="1"/>
  </g>`;
  const photo = art.querySelector('image');
  let loaded = false;
  let laidOut = false;
  const show = () => {
    if (loaded && laidOut) hero.classList.add('hero-photo-ready');
  };
  photo.addEventListener('load', () => { loaded = true; show(); });
  grid.prepend(art);

  const update = () => {
    const mobile = mobileMedia.matches;
    // Move the original links only on mobile; restore their exact desktop slot.
    if (mobile && links.parentNode !== grid) grid.appendChild(links);
    else if (!mobile && links.parentNode !== linksParent) linksParent.insertBefore(links, linksNext);

    const heroRect = hero.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const width = hero.clientWidth;
    const height = mobile ? copyViewport.getBoundingClientRect().bottom - heroRect.top : heroRect.height;
    if (width <= 0 || height <= 0) return;
    Object.assign(art.style, {
      left: (heroRect.left - gridRect.left) + 'px',
      top: (heroRect.top - gridRect.top) + 'px',
      width: width + 'px', height: height + 'px'
    });
    art.setAttribute('viewBox', `0 0 ${width} ${height}`);
    art.querySelectorAll('image').forEach(node => {
      node.setAttribute('width', width); node.setAttribute('height', height);
    });

    // The copy's entrance is a translation only. Measure its final position
    // so the background can be ready without waiting for that animation.
    const transform = getComputedStyle(copy).transform;
    const copyTranslateX = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
    const copyBottom = description.getBoundingClientRect().bottom - heroRect.top;
    let right, left;
    if (mobile) {
      // Follow the mobile guides: the right diagonal rises beside the last
      // paragraph, and the smaller left diagonal starts among the buttons.
      // Reserve clearance from the actual text lines, without white cutouts.
      const paragraphs = Array.from(description.querySelectorAll('p'));
      const lastParagraph = paragraphs[paragraphs.length - 1] || description;
      const rightBottomX = width * .50;
      let rightTop = lastParagraph.getBoundingClientRect().top - heroRect.top - 8;
      paragraphs.forEach(paragraph => {
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        Array.from(range.getClientRects()).forEach(rect => {
          const y = rect.bottom - heroRect.top + 6;
          if (y <= rightTop) return;
          const x = rect.right - heroRect.left - copyTranslateX + 8;
          const ratio = (width - x) / (width - rightBottomX);
          if (ratio >= 0 && ratio < 1) {
            rightTop = Math.max(rightTop, (y - ratio * height) / (1 - ratio));
          }
        });
      });
      const actionRect = actions.getBoundingClientRect();
      const leftTop = Math.max(copyBottom + 8, actionRect.top - heroRect.top + actionRect.height * .4);
      right = `M ${width} ${rightTop} L ${rightBottomX} ${height} H ${width} Z`;
      left = `M 0 ${leftTop} L ${width * .34} ${height} H 0 Z`;
    } else {
      const rightTopX = width * .79;
      const rightBottomX = width * .33;
      const leftTop = Math.max(height * .59, copyBottom + 16);
      const leftBottomX = width * .117;
      const leftSlope = leftBottomX / (height - leftTop);
      let rightShift = 0;
      let leftShift = 0;
      // Keep the established angles. Parallel offsets reserve clear white
      // space around the copy without blurred cutouts or extra containers.
      protectedCopy.forEach(node => {
        const rect = node.getBoundingClientRect();
        const y = Math.min(height, rect.bottom - heroRect.top + 12);
        if (y <= 0 || rect.top - heroRect.top >= height) return;
        const rightX = rightTopX + (rightBottomX - rightTopX) * y / height;
        rightShift = Math.max(rightShift, rect.right - heroRect.left - copyTranslateX + 12 - rightX);
        if (y > leftTop) {
          const leftX = leftSlope * (y - leftTop);
          leftShift = Math.max(leftShift, leftX - (rect.left - heroRect.left - copyTranslateX - 12));
        }
      });
      right = `M ${rightTopX + rightShift} 0 L ${rightBottomX + rightShift} ${height} H ${width} V 0 Z`;
      left = `M 0 ${leftTop + leftShift / leftSlope} L ${leftBottomX - leftShift} ${height} H 0 Z`;
    }
    art.querySelector('.hero-photo-right').setAttribute('d', right);
    art.querySelector('.hero-photo-left').setAttribute('d', left);
    laidOut = true;
    show();
  };
  let frame;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  [hero, grid, copy, collage].forEach(node => observer.observe(node));
  window.addEventListener('resize', schedule, { passive: true });
  update();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
})();
