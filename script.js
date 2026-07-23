// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
);
reveals.forEach((el) => io.observe(el));

// Header hairline after scroll
const head = document.querySelector(".site-head");
const onScroll = () => head.classList.toggle("scrolled", window.scrollY > 24);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

// Active nav section
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const targets = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
// Readership: world map + visit counts
(async () => {
  const mapEl = document.getElementById("reader-map");
  if (!mapEl) return;
  try {
    const svg = await fetch("assets/worldmap.svg").then((r) => r.text());
    mapEl.innerHTML = svg;
  } catch (e) { /* map stays empty; numbers still render */ }

  let stats = null;
  try {
    const r = await fetch("assets/stats.json", { cache: "no-cache" });
    if (r.ok) stats = await r.json();
  } catch (e) {}

  // total visits: stats file first, live public counter as fallback/refresher
  let total = stats && stats.total ? Number(stats.total) : 0;
  try {
    const r = await fetch("https://jacobzwj.goatcounter.com/counter/TOTAL.json");
    if (r.ok) {
      const d = await r.json();
      total = Math.max(total, Number(d.count_unique || d.count) || 0);
    }
  } catch (e) {}
  if (total > 0) {
    document.getElementById("r-visits").textContent = total.toLocaleString("en-US");
  }

  if (stats && Array.isArray(stats.countries) && stats.countries.length) {
    const cs = stats.countries.filter((c) => c.cc && c.n > 0);
    const max = Math.max(...cs.map((c) => c.n));
    for (const c of cs) {
      const el = mapEl.querySelector(`[data-cc="${c.cc}"]`);
      if (!el) continue;
      const ratio = c.n / max;
      el.classList.add(ratio > 0.5 ? "v3" : ratio > 0.15 ? "v2" : "v1");
    }
    document.getElementById("r-countries").textContent =
      ", from " + cs.length + (cs.length === 1 ? " country or region" : " countries & regions");
    const top = document.getElementById("r-top");
    top.innerHTML = cs
      .slice(0, 5)
      .map((c) => `<li><span>${c.name}</span><span>${c.n.toLocaleString("en-US")}</span></li>`)
      .join("");
  }

  // Per-paper read counts (clicks on the DOI link)
  if (stats && Array.isArray(stats.papers)) {
    const counts = new Map(stats.papers.map((p) => [p.id, Number(p.n) || 0]));
    document.querySelectorAll("article[data-paper]").forEach((art) => {
      const n = counts.get(art.getAttribute("data-paper")) || 0;
      art.insertAdjacentHTML(
        "beforeend",
        `<span class="pub-reads" title="Clicks on this paper’s link since July 2026"><span class="n">${n.toLocaleString("en-US")}</span>${n === 1 ? "read" : "reads"}</span>`
      );
    });
  }
})();

const spy = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
        );
      }
    }
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
targets.forEach((t) => spy.observe(t));
