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
// Visitor count (GoatCounter public counter)
fetch("https://jacobzwj.goatcounter.com/counter/TOTAL.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((d) => {
    if (!d) return;
    const n = Number(d.count_unique || d.count);
    if (n > 0) {
      document.getElementById("visits").textContent =
        " · " + n.toLocaleString("en-US") + (n === 1 ? " visit" : " visits");
    }
  })
  .catch(() => {});

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
