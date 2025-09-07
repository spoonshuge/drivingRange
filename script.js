// Timezone-safe open/closed badge for America/New_York
const HOURS = {
  0: { open: "08:00", close: "19:00" }, // Sun
  1: { open: "08:00", close: "19:00" }, // Mon
  2: { open: "08:00", close: "19:00" }, // Tue
  3: { open: "08:00", close: "19:00" }, // Wed
  4: { open: "08:00", close: "19:00" }, // Thu
  5: { open: "08:00", close: "19:00" }, // Fri
  6: { open: "07:00", close: "19:00" }  // Sat
};

function nowInNY() {
  // Build a Date from NY parts to avoid local timezone drift
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(new Date())
    .reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  // YYYY-MM-DDTHH:mm:ss for local Date constructor
  return new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
}

function isOpen(dateNY = nowInNY()) {
  const day = dateNY.getDay();
  const { open, close } = HOURS[day];
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  const openMins  = oh * 60 + om;
  const closeMins = ch * 60 + cm;
  const mins = dateNY.getHours() * 60 + dateNY.getMinutes();
  return mins >= openMins && mins < closeMins;
}

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function wireSmoothAnchors() {
  const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: preferReduced ? 'auto' : 'smooth', block: 'start' });
  });
}

function updateBadge() {
  const badge = document.querySelector('[data-open-badge]');
  if (!badge) return;
  const open = isOpen();
  badge.textContent = open ? 'Open now' : 'Closed now';
  badge.setAttribute('data-status', open ? 'open' : 'closed');
  badge.setAttribute('aria-label', open ? 'Range is currently open' : 'Range is currently closed');
}

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  wireSmoothAnchors();
  updateBadge();
  // Re-check every 5 minutes
  setInterval(updateBadge, 5 * 60 * 1000);
});
