/* ============================================================
   FACE OF FUTURE INDIA — Interactions
   ============================================================ */
(() => {
    'use strict';

    const root = document.documentElement;
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('scrollProgress');
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    const megaPanel = document.getElementById('megaPanel');
    const panelBackdrop = document.getElementById('panelBackdrop');
    const panelClose = document.getElementById('panelClose');
    const themeToggle = document.getElementById('themeToggle');

    /* ----------------------------------------------------------
       ALWAYS-VISIBLE FOOTER — measure height & set CSS var
       ---------------------------------------------------------- */
    const footerEl = document.querySelector('.footer');

    const measureFooter = () => {
        if (!footerEl) return;
        const h = footerEl.offsetHeight;
        document.documentElement.style.setProperty('--footer-h', h + 'px');
    };

    window.addEventListener('load', measureFooter);
    window.addEventListener('resize', () => {
        clearTimeout(window.__footerTimer);
        window.__footerTimer = setTimeout(measureFooter, 120);
    });

    if (megaPanel) {
        new MutationObserver(measureFooter).observe(megaPanel, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    measureFooter();

    /* ----------------------------------------------------------
       1. THEME — day / night
       ---------------------------------------------------------- */
    const STORAGE_KEY = 'fofi-theme';

    const applyTheme = (theme, persist = true) => {
        root.setAttribute('data-theme', theme);
        themeToggle?.setAttribute('aria-pressed', theme === 'dark');
        if (persist) localStorage.setItem(STORAGE_KEY, theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#14100C' : '#FF6B1A');
    };

    const initTheme = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
            applyTheme(saved, false);
            return;
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light', false);
    };
    initTheme();

    themeToggle?.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    /* ----------------------------------------------------------
       2. SCROLL — progress + navbar state
       ---------------------------------------------------------- */
    let ticking = false;
    const onScroll = () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 30);
        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const pct = h > 0 ? (y / h) * 100 : 0;
            progress.style.width = pct + '%';
        }
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ----------------------------------------------------------
       3. SMOOTH SCROLL HELPER
       ---------------------------------------------------------- */
    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 76;
        const top = el.getBoundingClientRect().top + window.scrollY - navH + 1;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    /* ----------------------------------------------------------
       4. MEGA PANEL — open / close
       ---------------------------------------------------------- */
    let lastFocused = null;
    const openPanel = (name) => {
        if (!megaPanel) return;

        megaPanel.querySelectorAll('.panel-view').forEach(v => {
            v.classList.toggle('active', v.dataset.view === name);
        });

        document.querySelectorAll('.nav-link[data-panel]').forEach(b => {
            b.classList.toggle('active', b.dataset.panel === name);
        });

        lastFocused = document.activeElement;
        panelBackdrop.hidden = false;
        megaPanel.classList.add('open');
        megaPanel.setAttribute('aria-hidden', 'false');
        document.body.classList.add('panel-open');

        requestAnimationFrame(() => panelClose?.focus());
    };

    const closePanel = () => {
        if (!megaPanel || !megaPanel.classList.contains('open')) return;

        megaPanel.classList.remove('open');
        megaPanel.setAttribute('aria-hidden', 'true');
        panelBackdrop.hidden = true;
        document.body.classList.remove('panel-open');

        document.querySelectorAll('.nav-link[data-panel]').forEach(b => b.classList.remove('active'));

        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    /* ----------------------------------------------------------
       5. DELEGATED CLICK HANDLER
       ---------------------------------------------------------- */
    document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-panel], [data-action], [data-scroll]');
        if (!t) return;

        const closeDrawer = () => {
            if (drawer?.classList.contains('open')) {
                drawer.classList.remove('open');
                drawer.setAttribute('aria-hidden', 'true');
                hamburger?.classList.remove('open');
                hamburger?.setAttribute('aria-expanded', 'false');
            }
        };

        if (t.dataset.panel) {
            e.preventDefault();
            closeDrawer();
            openPanel(t.dataset.panel);
            return;
        }

        if (t.dataset.action) {
            e.preventDefault();
            closeDrawer();
            closePanel();

            if (t.dataset.action === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (t.dataset.action === 'contact') {
                scrollToId('contact');
            }
            return;
        }

        if (t.dataset.scroll) {
            e.preventDefault();
            closeDrawer();
            closePanel();
            scrollToId(t.dataset.scroll);
        }
    });

    panelClose?.addEventListener('click', closePanel);
    panelBackdrop?.addEventListener('click', closePanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePanel();
            if (drawer?.classList.contains('open')) {
                drawer.classList.remove('open');
                drawer.setAttribute('aria-hidden', 'true');
                hamburger?.classList.remove('open');
                hamburger?.setAttribute('aria-expanded', 'false');
            }
        }
    });

    /* ----------------------------------------------------------
       6. HAMBURGER / DRAWER
       ---------------------------------------------------------- */
    hamburger?.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        drawer.setAttribute('aria-hidden', String(!isOpen));
    });

    /* ----------------------------------------------------------
       7. REVEAL ON SCROLL
       ---------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in'));
    }

    /* ----------------------------------------------------------
       8. ANIMATED COUNTERS
       ---------------------------------------------------------- */
    const counters = document.querySelectorAll('[data-count]');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        };
        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const cio = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting && !en.target.dataset.done) {
                    en.target.dataset.done = '1';
                    animateCount(en.target);
                    cio.unobserve(en.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => cio.observe(c));
    } else {
        counters.forEach(el => el.textContent = el.dataset.count);
    }

    /* ----------------------------------------------------------
       9. CONTACT FORM — collection + validation
       ---------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('#contactName').value.trim();
        const email = contactForm.querySelector('#contactEmail').value.trim();
        const message = contactForm.querySelector('#contactMsg').value.trim();

        // Reset note
        formNote.textContent = '';
        formNote.className = 'form-note';

        // Validate
        if (!name || !email || !message) {
            formNote.textContent = 'Please fill in all fields.';
            formNote.classList.add('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formNote.textContent = 'Please enter a valid email address.';
            formNote.classList.add('error');
            return;
        }

        // ---- Build submission payload ----
        const payload = {
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
            source: 'Face of Future India — Contact Form'
        };

        // ---- Store locally as backup (offline-friendly) ----
        try {
            const stored = JSON.parse(localStorage.getItem('fofi-contacts') || '[]');
            stored.push(payload);
            localStorage.setItem('fofi-contacts', JSON.stringify(stored));
        } catch (_) { /* storage may be full or blocked */ }

        // ---- SUCCESS UI ----
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #16A34A, #22C55E)';
        formNote.textContent = 'Thank you, ' + name + '! We\'ll get back to you at ' + email + '.';
        formNote.classList.add('success');

        // Reset after 3s
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            contactForm.reset();
            formNote.textContent = '';
            formNote.className = 'form-note';
        }, 3200);

        /*
          ── BACKEND INTEGRATION (uncomment when ready) ──
          
          fetch('https://formspree.io/f/xaenyyyq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          })
          .then(r => r.ok ? r.json() : Promise.reject(r))
          .then(() => console.log('✓ Sent to server'))
          .catch(err => console.warn('✗ Server error — stored locally', err));
        
    });
    */

    /* ----------------------------------------------------------
       10. NEWSLETTER (demo handler)
       ---------------------------------------------------------- */
    const newsletter = document.getElementById('newsletter');
    newsletter?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletter.querySelector('input');
        if (!input || !input.value) return;
        const btn = newsletter.querySelector('button');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        input.value = '';
        setTimeout(() => { btn.innerHTML = original; }, 1800);
    });

    /* ----------------------------------------------------------
       11. HASH ON LOAD — open matching panel if linked
       ---------------------------------------------------------- */
    const hash = window.location.hash.replace('#', '');
    const validPanels = ['innovation', 'startups', 'research', 'future', 'aitools'];
    if (validPanels.includes(hash)) {
        setTimeout(() => openPanel(hash), 200);
    } else if (hash === 'contact-form') {
        setTimeout(() => scrollToId('contact-form'), 300);
    }

    /* ----------------------------------------------------------
       12. SEO: Update document title on panel open (for history)
       ---------------------------------------------------------- */
    const titles = {
        innovation: 'AI Innovation in India — Face of Future India',
        startups: 'Top AI Startups in India — Face of Future India',
        research: 'AI Research & Development — Face of Future India',
        future: 'Future of AI in India — Face of Future India',
        aitools: 'AI Tools FY 2026-27 — Face of Future India'
    };

    const originalTitle = document.title;

    // Patch openPanel to update title
    const _openPanel = openPanel;
    const _closePanel = closePanel;

    // (Handled inside openPanel below via wrapper — but for clarity we
    //  simply listen for the panel state and update the title)
    const titleObserver = new MutationObserver(() => {
        if (megaPanel?.classList.contains('open')) {
            const active = megaPanel.querySelector('.panel-view.active');
            if (active && titles[active.dataset.view]) {
                document.title = titles[active.dataset.view];
            }
        } else {
            document.title = originalTitle;
        }
    });
    if (megaPanel) {
        titleObserver.observe(megaPanel, { attributes: true, attributeFilter: ['class'] });
    }

})();
