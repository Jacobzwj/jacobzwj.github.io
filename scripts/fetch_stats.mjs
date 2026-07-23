// Pulls aggregate stats from GoatCounter and writes assets/stats.json.
// Runs in GitHub Actions daily; requires GOATCOUNTER_API_TOKEN.
import { writeFileSync } from "node:fs";

const SITE = "https://jacobzwj.goatcounter.com";
const START = "2026-07-01";
const token = process.env.GOATCOUNTER_API_TOKEN;
if (!token) {
  console.error("GOATCOUNTER_API_TOKEN not set");
  process.exit(1);
}

const end = new Date().toISOString().slice(0, 10);
const api = async (path) => {
  const r = await fetch(`${SITE}/api/v0${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!r.ok) throw new Error(`${path} -> ${r.status}: ${await r.text()}`);
  return r.json();
};

const q = `start=${START}&end=${end}`;

const totalRes = await api(`/stats/total?${q}`);
const total = totalRes.total ?? 0;

let countries = [];
try {
  const loc = await api(`/stats/locations?${q}&limit=100`);
  countries = (loc.stats || [])
    .map((s) => ({ cc: (s.id || "").toUpperCase(), name: s.name || s.id, n: s.count ?? 0 }))
    .filter((c) => c.cc && c.n > 0)
    .sort((a, b) => b.n - a.n);
} catch (e) {
  console.error("locations failed:", e.message);
}

let papers = [];
try {
  const hits = await api(`/stats/hits?${q}&limit=100&daily=false`);
  papers = (hits.hits || [])
    .filter((h) => h.event && /^paper\//.test(h.path))
    .map((h) => ({ id: h.path, n: h.count ?? 0 }))
    .sort((a, b) => b.n - a.n);
} catch (e) {
  console.error("hits failed:", e.message);
}

const out = { updated: end, total, countries, papers };
writeFileSync(new URL("../assets/stats.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`stats.json written: ${total} visits, ${countries.length} countries, ${papers.length} tracked papers`);
