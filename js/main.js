/* Renders data/*.yml into the page. Owners should not need to edit this file. */
(function () {
  'use strict';

  var DATA = {
    profile: 'data/profile.yml',
    publications: 'data/publications.yml',
    experience: 'data/experience.yml'
  };

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Block javascript:, data:, vbscript: URLs; everything else (http, mailto, relative) is fine.
  function safeUrl(u) {
    u = String(u == null ? '' : u).trim();
    return /^(javascript|data|vbscript):/i.test(u.replace(/[\s\u0000-\u001f]/g, '')) ? '#' : u;
  }

  function isExternal(u) { return /^https?:\/\//i.test(u); }

  function linkAttrs(u) {
    var url = safeUrl(u);
    return 'href="' + esc(url) + '"' + (isExternal(url) ? ' target="_blank" rel="noopener noreferrer"' : '');
  }

  // Tiny inline markdown: [text](url), **bold**, *italic*. Input is escaped first.
  function inline(s) {
    var out = esc(s);
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, text, url) {
      // url was escaped by esc(); unescape &amp; so query strings keep working, then re-escape in linkAttrs
      return '<a ' + linkAttrs(url.replace(/&amp;/g, '&')) + '>' + text + '</a>';
    });
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    return out;
  }

  function paragraphs(s) {
    return String(s || '').trim().split(/\n\s*\n/).filter(Boolean).map(function (p) {
      return '<p>' + inline(p.replace(/\s*\n\s*/g, ' ')) + '</p>';
    }).join('');
  }

  function asArray(v) { return Array.isArray(v) ? v : (v == null || v === '' ? [] : [v]); }

  function loadYaml(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path + ': HTTP ' + r.status);
      return r.text();
    }).then(function (txt) {
      try { return window.jsyaml.load(txt) || {}; }
      catch (e) { throw new Error(path + ' has a YAML syntax error / 格式錯誤:\n' + e.message); }
    });
  }

  /* ---------- icons (24x24) ---------- */
  var ICONS = {
    email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    scholar: 'M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    cv: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    orcid: 'M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z',
    twitter: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
    website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'
  };
  var LINK_LABELS = {
    email: 'Email', scholar: 'Google Scholar', github: 'GitHub', linkedin: 'LinkedIn',
    cv: 'CV', orcid: 'ORCID', twitter: 'X / Twitter', website: 'Website'
  };
  var LINK_ORDER = ['email', 'scholar', 'github', 'linkedin', 'cv', 'orcid', 'twitter', 'website'];

  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[name] || ICONS.website) + '"/></svg>';
  }

  /* ---------- profile ---------- */
  var myNames = [];

  function renderProfile(p) {
    $all('[data-bind]').forEach(function (el) {
      var v = p[el.getAttribute('data-bind')];
      if (v) el.textContent = v;
    });

    if (p.name) document.title = p.name + (p.title ? ' · ' + p.title : '');
    var desc = $('meta[name="description"]');
    if (desc && p.name) desc.setAttribute('content', p.name + (p.title ? ', ' + p.title : '') + (p.affiliation && p.affiliation.name ? ' at ' + p.affiliation.name : ''));

    var photo = $('#profile-photo');
    if (p.photo) {
      photo.src = safeUrl(p.photo);
      photo.alt = 'Photo of ' + (p.name || 'the site owner');
    } else {
      photo.closest('.about-photo-wrap').hidden = true;
    }

    var aff = p.affiliation, affEl = $('#affiliation');
    if (aff && typeof aff === 'object' && aff.name) {
      affEl.innerHTML = aff.url ? '<a ' + linkAttrs(aff.url) + '>' + esc(aff.name) + '</a>' : esc(aff.name);
    } else if (typeof aff === 'string' && aff) {
      affEl.textContent = aff;
    }
    if (!p.title || !affEl.textContent) $('.about-sep').classList.add('empty');

    if (p.location) { var loc = $('#location'); loc.textContent = p.location; loc.hidden = false; }

    var links = p.links || {};
    var keys = LINK_ORDER.filter(function (k) { return links[k]; })
      .concat(Object.keys(links).filter(function (k) { return LINK_ORDER.indexOf(k) < 0 && links[k]; }));
    $('#social-links').innerHTML = keys.map(function (k) {
      var url = String(links[k]);
      if (k === 'email' && !/^mailto:/i.test(url)) url = 'mailto:' + url;
      var label = LINK_LABELS[k] || k;
      return '<li><a ' + linkAttrs(url) + '>' + icon(k) + '<span>' + esc(label) + '</span></a></li>';
    }).join('');

    $('#bio').innerHTML = paragraphs(p.bio);
    $('#interests').innerHTML = asArray(p.interests).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

    myNames = asArray(p.author_names).concat(p.name ? [p.name] : []).map(normName);

    var f = p.footer || {}, year = new Date().getFullYear();
    var span = f.since && Number(f.since) < year ? f.since + '–' + year : String(year);
    $('#copyright').innerHTML = '&copy; ' + esc(span) + ' ' + esc(p.name || '');
    if (f.note) { var n = $('#footer-note'); n.innerHTML = inline(f.note); n.hidden = false; }
  }

  function normName(s) { return String(s).replace(/[*†‡]+$/, '').replace(/\s+/g, ' ').trim().toLowerCase(); }

  /* ---------- publications ---------- */
  function authorHtml(a) {
    var raw = String(a), m = raw.match(/^(.*?)([*†‡]+)$/);
    var name = m ? m[1].trim() : raw.trim(), mark = m ? m[2] : '';
    var html = esc(name) + (mark ? '<sup>' + esc(mark) + '</sup>' : '');
    return myNames.indexOf(normName(name)) >= 0 ? '<span class="me">' + html + '</span>' : html;
  }

  function pubHtml(pub) {
    var authors = asArray(pub.authors).map(authorHtml).join(', ');
    var links = pub.links && typeof pub.links === 'object' ? Object.keys(pub.links).filter(function (k) { return pub.links[k]; }) : [];
    var img = pub.image ? '<img class="pub-thumb" src="' + esc(safeUrl(pub.image)) + '" alt="" loading="lazy" decoding="async">' : '';
    return '<li class="pub' + (img ? ' has-image' : '') + '"' + (pub.selected ? ' data-selected' : '') + '>' +
      img +
      '<div class="pub-body">' +
        '<h4 class="pub-title">' + inline(pub.title || 'Untitled') + '</h4>' +
        (authors ? '<p class="pub-authors">' + authors + '</p>' : '') +
        '<div class="pub-meta">' +
          (pub.venue ? '<span class="pub-venue">' + inline(pub.venue) + '</span>' : '') +
          (pub.note ? '<span class="pub-note">' + esc(pub.note) + '</span>' : '') +
        '</div>' +
        (links.length ? '<div class="pub-links">' + links.map(function (k) {
          return '<a ' + linkAttrs(pub.links[k]) + '>' + esc(k) + '</a>';
        }).join('') + '</div>' : '') +
      '</div></li>';
  }

  var allPubs = [];

  function renderPublications(list, filter) {
    var pubs = filter === 'selected' ? list.filter(function (p) { return p.selected; }) : list;
    var box = $('#pub-list');
    if (!pubs.length) { box.innerHTML = '<p class="empty-state">No publications yet.</p>'; return; }

    var groups = {}, order = [];
    pubs.forEach(function (p) {
      var y = p.year != null && p.year !== '' ? String(p.year) : 'Other';
      if (!groups[y]) { groups[y] = []; order.push(y); }
      groups[y].push(p);
    });
    order.sort(function (a, b) {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return Number(b) - Number(a) || (b > a ? 1 : -1);
    });

    box.innerHTML = order.map(function (y) {
      return '<h3 class="pub-year">' + esc(y) + '</h3><ol class="pub-items">' + groups[y].map(pubHtml).join('') + '</ol>';
    }).join('');

    var hasEqual = pubs.some(function (p) { return asArray(p.authors).some(function (a) { return /\*$/.test(String(a)); }); });
    $('#pub-legend').hidden = !hasEqual;
    observeReveal($all('.pub, .pub-year', box));
  }

  function setupPubFilter(list) {
    var anySel = list.some(function (p) { return p.selected; });
    var allSel = list.every(function (p) { return p.selected; });
    var group = $('.pub-filter');
    var current = 'all';
    if (anySel && !allSel) {
      group.hidden = false;
      $all('button', group).forEach(function (b) {
        b.addEventListener('click', function () {
          current = b.getAttribute('data-filter');
          $all('button', group).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          renderPublications(list, current);
        });
        b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === current));
      });
    }
    renderPublications(list, current);
  }

  /* ---------- experience ---------- */
  function isPresent(end) { return !end || /^(present|now|current|至今|現在)$/i.test(String(end).trim()); }

  function expHtml(e) {
    var present = isPresent(e.end);
    var date = esc(e.start || '') + (e.start ? ' – ' : '') + (present ? 'Present' : esc(e.end));
    var org = e.org ? (e.url ? '<a ' + linkAttrs(e.url) + '>' + esc(e.org) + '</a>' : esc(e.org)) : '';
    var details = asArray(e.details);
    return '<li class="timeline-item' + (present && e.start ? ' current' : '') + '">' +
      '<div class="tl-head">' +
        (e.logo ? '<img class="tl-logo" src="' + esc(safeUrl(e.logo)) + '" alt="" loading="lazy">' : '') +
        '<div>' +
          '<span class="tl-date">' + date + '</span>' +
          '<h4 class="tl-title">' + inline(e.title || '') + '</h4>' +
          '<p class="tl-org">' + org + (e.location ? (org ? ' · ' : '') + '<span class="tl-loc">' + esc(e.location) + '</span>' : '') + '</p>' +
        '</div>' +
      '</div>' +
      (details.length ? '<ul class="tl-details">' + details.map(function (d) { return '<li>' + inline(d) + '</li>'; }).join('') + '</ul>' : '') +
      '</li>';
  }

  function renderExperience(x) {
    ['education', 'work'].forEach(function (key) {
      var items = asArray(x[key]);
      var ol = $('#' + key);
      if (!items.length) { ol.closest('.exp-col').hidden = true; return; }
      ol.innerHTML = items.map(expHtml).join('');
      observeReveal($all('.timeline-item', ol));
    });
  }

  /* ---------- theme ---------- */
  function setupTheme() {
    var btn = $('.theme-toggle'), root = document.documentElement;
    var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
    function stored() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
    function apply(t) {
      root.setAttribute('data-theme', t);
      btn.setAttribute('aria-pressed', String(t === 'dark'));
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    apply(root.getAttribute('data-theme') || 'light');
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
    // Follow OS changes only while the visitor has not made an explicit choice.
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); });
    }
  }

  /* ---------- nav: scroll state + scroll-spy ---------- */
  function setupNav() {
    var header = $('.site-header');
    function onScroll() { header.classList.toggle('scrolled', window.scrollY > 4); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window)) return;
    var links = $all('.nav-links a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $all('main .section').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal-on-scroll ---------- */
  var revealer = null;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
  }
  function observeReveal(els) {
    if (!revealer) return;
    els.forEach(function (el) { el.classList.add('reveal'); revealer.observe(el); });
  }

  /* ---------- boot ---------- */
  function showError(err) {
    var box = $('#load-error');
    var hint = location.protocol === 'file:'
      ? ' Open the site through a web server (e.g. `python3 -m http.server`) instead of double-clicking index.html. / 請用本機伺服器開啟,而不是直接點兩下 index.html。'
      : '';
    box.textContent = 'Could not load site content / 無法載入內容: ' + (err && err.message ? err.message : err) + hint;
    box.style.whiteSpace = 'pre-wrap';
    box.hidden = false;
    if (window.console) console.error(err);
  }

  function boot() {
    setupTheme();
    setupNav();
    if (!window.jsyaml) { showError('vendor/js-yaml.min.js failed to load'); return; }

    // Profile first (publications need author_names for highlighting).
    loadYaml(DATA.profile).then(function (p) {
      renderProfile(p);
      observeReveal([$('.about')]);
    }).catch(showError).then(function () {
      return Promise.all([
        loadYaml(DATA.publications).then(function (pubs) { allPubs = asArray(pubs); setupPubFilter(allPubs); }).catch(showError),
        loadYaml(DATA.experience).then(renderExperience).catch(showError)
      ]);
    }).then(function () {
      // Re-apply hash scroll now that content has its final height.
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
