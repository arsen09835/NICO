/* Mobile-only disclosures; the original desktop nodes are restored on resize. */
(() => {
  'use strict';
  const groups = [
    { selector: '.ledger-list .category-copy', prefix: 'category' },
    { selector: '.sgomberi-process .sgomberi-step', prefix: 'step' }
  ];
  const media = matchMedia('(max-width:900px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const records = [];
  let refreshFrame;
  const refresh = () => {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  };

  const toggle = (record, expanded) => {
    const { button, panel } = record;
    const startHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    if (record.animation) record.animation.cancel();
    button.setAttribute('aria-expanded', String(expanded));
    if (reduced.matches || typeof panel.animate !== 'function') {
      panel.hidden = !expanded;
      refresh();
      return;
    }
    panel.hidden = false;
    const endHeight = expanded ? panel.scrollHeight : 0;
    const animation = panel.animate(
      [{ height: startHeight + 'px' }, { height: endHeight + 'px' }],
      { duration: 210, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'forwards' }
    );
    record.animation = animation;
    animation.onfinish = () => {
      if (record.animation !== animation) return;
      panel.hidden = !expanded;
      record.animation = null;
      animation.cancel();
      refresh();
    };
  };

  const enable = () => {
    groups.forEach(({ selector, prefix }) => {
      document.querySelectorAll(selector).forEach((container, index) => {
        const heading = container.querySelector('h2');
        if (!heading) return;
        const content = [];
        for (let node = heading.nextSibling; node; node = node.nextSibling) content.push(node);
        if (!content.length) return;
        const headingNodes = Array.from(heading.childNodes);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-disclosure-toggle';
        button.id = `mobile-${prefix}-${index + 1}-toggle`;
        const panel = document.createElement('div');
        panel.className = 'mobile-disclosure-panel';
        panel.id = `mobile-${prefix}-${index + 1}-panel`;
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', button.id);
        button.setAttribute('aria-controls', panel.id);
        button.setAttribute('aria-expanded', String(index === 0));
        const label = document.createElement('span');
        label.className = 'mobile-disclosure-label';
        label.append(...headingNodes);
        const mark = document.createElement('span');
        mark.className = 'mobile-disclosure-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 6 5 5 5-5"/></svg>';
        button.append(label, mark);
        heading.append(button);
        heading.classList.add('mobile-disclosure-heading');
        panel.append(...content);
        panel.hidden = index !== 0;
        heading.after(panel);
        const record = { heading, headingNodes, content, button, panel, animation: null };
        records.push(record);
        button.addEventListener('click', () => toggle(record, button.getAttribute('aria-expanded') !== 'true'));
      });
    });
    refresh();
  };

  const disable = () => {
    records.splice(0).forEach(record => {
      if (record.animation) record.animation.cancel();
      record.heading.replaceChildren(...record.headingNodes);
      record.heading.classList.remove('mobile-disclosure-heading');
      if (!record.heading.className) record.heading.removeAttribute('class');
      record.panel.before(...record.content);
      record.panel.remove();
    });
    refresh();
  };
  const sync = () => {
    if (media.matches && !records.length) enable();
    else if (!media.matches && records.length) disable();
  };
  media.addEventListener('change', sync);
  sync();
})();
