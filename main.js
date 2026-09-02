/*
 * Progressive enhancement only. Every word of content is in index.html; this file
 * adds the live clock, the online badge, the theme toggle and copy-to-clipboard.
 * With JavaScript off the page still renders in full — you just get the static
 * availability line instead of a ticking clock, and the email pill stays a
 * plain mailto: link.
 */
(function () {
	"use strict";

	var ZONE = "Europe/Prague";
	var CITY = "ÚSTÍ NAD LABEM";
	var ONLINE_FROM = 8; // inclusive
	var ONLINE_TO = 16; // exclusive

	var $ = function (sel) {
		return document.querySelector(sel);
	};

	/* --- clock and availability ------------------------------------------- */

	var weekdayEl = $("[data-weekday]");
	var dateEl = $("[data-date]");
	var timeEl = $("[data-time]");
	var zoneEl = $("[data-zone]");
	var statusEl = $("[data-status]");
	var statusTextEl = $("[data-status-text]");
	var tooltipEl = $("[data-status-tooltip]");

	/* "GMT+1" / "GMT+5:30" for the zone as it stands right now, so DST is handled. */
	function gmtOffset(date) {
		var parts = new Intl.DateTimeFormat("en-GB", {
			timeZone: ZONE,
			timeZoneName: "longOffset",
		}).formatToParts(date);
		var raw = "GMT";
		for (var i = 0; i < parts.length; i++) {
			if (parts[i].type === "timeZoneName") raw = parts[i].value;
		}
		var match = raw.match(/GMT([+-])(\d{2}):(\d{2})/);
		if (!match) return "GMT";
		return "GMT" + match[1] + Number(match[2]) + (match[3] === "00" ? "" : ":" + match[3]);
	}

	function localHour(date) {
		return Number(
			new Intl.DateTimeFormat("en-GB", {
				timeZone: ZONE,
				hour: "2-digit",
				hourCycle: "h23",
			}).format(date),
		);
	}

	function tick() {
		var now = new Date();

		if (weekdayEl) {
			weekdayEl.textContent = now
				.toLocaleDateString("en-GB", { timeZone: ZONE, weekday: "long" })
				.toUpperCase();
		}
		if (dateEl) {
			dateEl.textContent = now
				.toLocaleDateString("en-GB", {
					timeZone: ZONE,
					day: "numeric",
					month: "long",
					year: "numeric",
				})
				.toUpperCase();
		}
		if (timeEl) {
			timeEl.textContent = now.toLocaleTimeString("en-GB", {
				timeZone: ZONE,
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hourCycle: "h23",
			});
		}
		if (zoneEl) zoneEl.textContent = CITY + " | " + gmtOffset(now);

		if (statusEl) {
			var hour = localHour(now);
			var online = hour >= ONLINE_FROM && hour < ONLINE_TO;
			statusEl.hidden = false;
			statusEl.classList.toggle("green", online);
			statusEl.classList.toggle("red", !online);
			if (statusTextEl) statusTextEl.textContent = online ? "online" : "offline";
			if (tooltipEl) {
				tooltipEl.textContent = online ? "Hit me up!" : "I'll get back to you tomorrow.";
			}
		}
	}

	tick();
	setInterval(tick, 1000);

	var yearEl = $("[data-year]");
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	/* --- theme toggle ------------------------------------------------------ */

	var root = document.documentElement;
	var toggle = $("[data-theme-toggle]");

	function effectiveTheme() {
		if (root.classList.contains("dark")) return "dark";
		if (root.classList.contains("light")) return "light";
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	if (toggle) {
		toggle.hidden = false;
		toggle.addEventListener("click", function () {
			var next = effectiveTheme() === "dark" ? "light" : "dark";
			root.classList.remove("light", "dark");
			root.classList.add(next);
			try {
				localStorage.setItem("theme", next);
			} catch (e) {
				// Private mode — the choice just will not survive a reload.
			}
		});
	}

	/* --- copy email -------------------------------------------------------- */

	var copyLink = $("[data-copy]");

	function writeToClipboard(text) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return navigator.clipboard.writeText(text).then(
				function () {
					return true;
				},
				function () {
					return legacyCopy(text);
				},
			);
		}
		return Promise.resolve(legacyCopy(text));
	}

	/* The async Clipboard API needs focus and a secure context; this is the fallback. */
	function legacyCopy(text) {
		try {
			var el = document.createElement("textarea");
			el.value = text;
			el.setAttribute("readonly", "");
			el.style.position = "fixed";
			el.style.opacity = "0";
			document.body.appendChild(el);
			el.select();
			var ok = document.execCommand("copy");
			document.body.removeChild(el);
			return ok;
		} catch (e) {
			return false;
		}
	}

	if (copyLink) {
		var label = copyLink.querySelector("[data-copy-label]");
		var address = copyLink.getAttribute("data-copy");
		var resetId;

		copyLink.addEventListener("click", function (event) {
			// Let modified clicks and middle-clicks behave like the link they are.
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
			event.preventDefault();

			writeToClipboard(address).then(function (ok) {
				if (!ok) {
					window.location.href = "mailto:" + address;
					return;
				}
				copyLink.classList.add("copied");
				if (label) label.textContent = "Copied";
				clearTimeout(resetId);
				resetId = setTimeout(function () {
					copyLink.classList.remove("copied");
					if (label) label.textContent = address;
				}, 1800);
			});
		});
	}
})();
