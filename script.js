"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const openStatusEl = document.getElementById("open-status");
  const yearEl = document.getElementById("year");

  // Year in footer
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Mobile nav toggle
  if (navToggle && siteNav) {
    const closeNav = () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    const openNav = () => {
      siteNav.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
    };
    const toggleNav = () => {
      const isOpen = siteNav.classList.contains("open");
      isOpen ? closeNav() : openNav();
    };

    navToggle.addEventListener("click", toggleNav);

    // Close when clicking a nav link
    siteNav.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") {
        closeNav();
      }
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!siteNav.classList.contains("open")) return;
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (!siteNav.contains(target) && !navToggle.contains(target)) {
        closeNav();
      }
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeNav();
        navToggle.blur();
      }
    });

    // Ensure state on resize
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll for on-page anchors + close nav
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      if (siteNav) siteNav.classList.remove("open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      history.pushState(null, "", href);
    });
  });

  // Hours/open status (America/New_York)
  try {
    const tz = "America/New_York";

    // Minutes since midnight helpers
    const HOURS = [
      { open: 8 * 60, close: 19 * 60 }, // Sunday
      { open: 8 * 60, close: 19 * 60 }, // Monday
      { open: 8 * 60, close: 19 * 60 }, // Tuesday
      { open: 8 * 60, close: 19 * 60 }, // Wednesday
      { open: 8 * 60, close: 19 * 60 }, // Thursday
      { open: 8 * 60, close: 19 * 60 }, // Friday
      { open: 7 * 60, close: 19 * 60 }, // Saturday
    ];
    const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getNowInTZ = (tz) => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).formatToParts(now);
      const w = parts.find((p) => p.type === "weekday")?.value || "Sun";
      const h = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
      const m = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
      const dayIndex = Math.max(0, weekdayShort.indexOf(w));
      return { dayIndex, minutes: h * 60 + m };
    };

    const formatTime12h = (mins) => {
      let h = Math.floor(mins / 60);
      const m = mins % 60;
      const suffix = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      return m ? `${h}:${String(m).padStart(2, "0")} ${suffix}` : `${h} ${suffix}`;
    };

    const { dayIndex, minutes } = getNowInTZ(tz);

    // Highlight today's hours row (list is Sunday-first)
    const rows = document.querySelectorAll(".hours-list li");
    if (rows[dayIndex]) rows[dayIndex].classList.add("today");

    const today = HOURS[dayIndex];
    const isOpenNow = minutes >= today.open && minutes < today.close;

    const nextOpenInfo = () => {
      if (minutes < today.open) {
        return { dayIndex, time: today.open, label: "today" };
      }
      for (let i = 1; i <= 7; i++) {
        const di = (dayIndex + i) % 7;
        const open = HOURS[di].open;
        if (open != null) {
          return { dayIndex: di, time: open, label: i === 1 ? "tomorrow" : weekdayLong[di] };
        }
      }
      return { dayIndex, time: today.open, label: "soon" };
    };

    if (openStatusEl) {
      if (isOpenNow) {
        openStatusEl.textContent = `Open now • Until ${formatTime12h(today.close)}`;
        openStatusEl.classList.remove("closed");
        openStatusEl.classList.add("open");
      } else {
        const next = nextOpenInfo();
        const dayLabel =
          next.label === "today" ? "" : next.label === "tomorrow" ? " tomorrow" : ` ${weekdayLong[next.dayIndex]}`;
        openStatusEl.textContent = `Closed now • Opens${dayLabel} at ${formatTime12h(next.time)}`;
        openStatusEl.classList.remove("open");
        openStatusEl.classList.add("closed");
      }
    }
  } catch {
    if (openStatusEl) {
      openStatusEl.textContent = "See hours below";
    }
  }
});
