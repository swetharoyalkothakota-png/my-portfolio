/* Portfolio interactions: small, dependency-free modules. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader + page-ready ---------- */
  function initLoader() {
    const loader = $("#loader");
    const done = () => {
      document.body.classList.add("is-ready");
      if (loader) loader.classList.add("is-done");
    };
    const wait = reduceMotion ? 0 : 900;
    const start = () => setTimeout(done, wait);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    setTimeout(done, 3500); // safety net
  }

  /* ---------- Hero name: split into words for reveal ---------- */
  function initSplit() {
    $$("[data-split]").forEach((el) => {
      const text = el.textContent.trim();
      el.setAttribute("aria-label", text);
      el.textContent = "";
      text.split(/\s+/).forEach((word, i, arr) => {
        const outer = document.createElement("span");
        outer.className = "word";
        outer.setAttribute("aria-hidden", "true");
        const inner = document.createElement("span");
        inner.style.setProperty("--i", i);
        inner.textContent = word;
        outer.appendChild(inner);
        el.appendChild(outer);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
      });
    });
  }

  /* ---------- Typing effect ---------- */
  function initTyping() {
    const el = $("#typed");
    if (!el) return;
    let words;
    try { words = JSON.parse(el.dataset.words); } catch { words = []; }
    if (!words.length) return;
    if (reduceMotion) { el.textContent = words.join(", "); return; }

    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 90;
      if (!deleting && c === word.length) { deleting = true; delay = 1600; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1800);
  }

  /* ---------- Navbar ---------- */
  function initNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const menu = $("#navMenu");
    const links = $$(".nav__link");

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    links.forEach((l) => l.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) setOpen(false);
    });
    window.matchMedia("(min-width: 821px)").addEventListener("change", () => setOpen(false));

    // Active section highlighting
    const map = new Map(links.map((l) => [l.getAttribute("href").slice(1), l]));
    const sections = $$("main section[id]").filter((s) => map.has(s.id));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
          const active = map.get(entry.target.id);
          active.classList.add("is-active");
          active.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = $$(".reveal, .timeline");
    // Stagger siblings inside groups
    $$(".reveal-group").forEach((group) => {
      $$(".reveal", group).forEach((el, i) => el.style.setProperty("--delay", `${Math.min(i, 6) * 70}ms`));
    });
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Cursor glow + skill card spotlight (fine pointers only) ---------- */
  function initPointerEffects() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const glow = $(".cursor-glow");
    let raf = 0, x = 0, y = 0;
    window.addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${x}px, ${y}px)`;
        glow.style.opacity = "1";
        raf = 0;
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => { glow.style.opacity = "0"; });

    $$(".skill").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    const btn = $("#toTop");
    const toggle = () => btn.classList.toggle("is-visible", window.scrollY > 600);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    const form = $("#contactForm");
    if (!form) return;
    const status = $("#formStatus");
    const endpoint = (form.dataset.endpoint || "").trim();

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
      message: (v) => (v.trim().length >= 10 ? "" : "Please write at least 10 characters."),
    };
    const errIds = { name: "nameErr", email: "emailErr", message: "msgErr" };

    const check = (field) => {
      const input = form.elements[field];
      const msg = rules[field](input.value);
      $("#" + errIds[field]).textContent = msg;
      input.closest(".field").classList.toggle("has-error", Boolean(msg));
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };
    Object.keys(rules).forEach((f) => {
      form.elements[f].addEventListener("blur", () => check(f));
      form.elements[f].addEventListener("input", () => {
        if (form.elements[f].closest(".field").classList.contains("has-error")) check(f);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form__status";
      const valid = Object.keys(rules).map(check).every(Boolean);
      if (!valid) {
        status.textContent = "Please fix the highlighted fields.";
        status.classList.add("err");
        const bad = $(".has-error input, .has-error textarea", form);
        if (bad) bad.focus();
        return;
      }
      if (!endpoint) {
        status.textContent = "The form isn't connected to an email service yet, so nothing was sent. See the README to connect Formspree or Web3Forms.";
        status.classList.add("err");
        return;
      }
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      status.textContent = "Sending...";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        status.textContent = "Thanks! Your message has been sent.";
        status.classList.add("ok");
      } catch {
        status.textContent = "Something went wrong. Please try again later.";
        status.classList.add("err");
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  initSplit();
  initLoader();
  initTyping();
  initNav();
  initReveal();
  initPointerEffects();
  initToTop();
  initForm();
  initYear();
})();
