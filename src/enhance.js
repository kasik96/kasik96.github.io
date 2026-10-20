/*
 * Progressive enhancement only. Without this file every word is still on the
 * page, the "machine" toggle is a plain link to /llms.txt, and the presence
 * dots stay green.
 *
 * With it: the toggle swaps views in place and mirrors the choice in the URL
 * (?view=machine), and the presence dots dim outside working hours.
 */
(function () {
	"use strict";

	var root = document.documentElement;
	var human = document.getElementById("main");
	var tpl = document.getElementById("machine-view");
	var segs = document.querySelectorAll("[data-view]");
	var machine = null;

	function mountMachine() {
		if (!machine && tpl) {
			machine = tpl.content.firstElementChild.cloneNode(true);
			tpl.parentNode.insertBefore(machine, tpl);
		}
		return machine;
	}

	function render(view, focus) {
		var isMachine = view === "machine";
		if (isMachine) mountMachine();
		if (isMachine) root.dataset.view = "machine";
		else delete root.dataset.view;
		human.hidden = isMachine;
		if (machine) machine.hidden = !isMachine;
		for (var i = 0; i < segs.length; i++) {
			if (segs[i].getAttribute("data-view") === view) segs[i].setAttribute("aria-current", "page");
			else segs[i].removeAttribute("aria-current");
		}
		if (focus) (isMachine ? machine : human).focus({ preventScroll: true });
	}

	function viewFromUrl() {
		return new URLSearchParams(location.search).get("view") === "machine" ? "machine" : "human";
	}

	for (var i = 0; i < segs.length; i++) {
		segs[i].addEventListener("click", function (event) {
			// Modified clicks keep their link behaviour: open / or /llms.txt in a new tab.
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
			event.preventDefault();
			var view = this.getAttribute("data-view");
			if (view === viewFromUrl()) return;
			var url = new URL(location.href);
			if (view === "machine") url.searchParams.set("view", "machine");
			else url.searchParams.delete("view");
			url.hash = "";
			history.pushState(null, "", url);
			render(view, true);
			window.scrollTo(0, 0);
		});
	}

	window.addEventListener("popstate", function () {
		render(viewFromUrl(), false);
	});

	render(viewFromUrl(), false);

	/* --- presence: green during the working hours declared in the header --- */

	var dots = document.querySelectorAll("[data-presence]");
	var where = document.querySelector("[data-hours]");
	var hours = where ? where.getAttribute("data-hours").split("-") : [];
	var from = parseInt(hours[0], 10);
	var to = parseInt(hours[1], 10);

	function updatePresence() {
		var hour = Number(
			new Intl.DateTimeFormat("en-GB", { timeZone: where.getAttribute("data-tz"), hour: "2-digit", hourCycle: "h23" }).format(
				new Date(),
			),
		);
		var online = hour >= from && hour < to;
		for (var j = 0; j < dots.length; j++) dots[j].classList.toggle("away", !online);
	}

	if (where && !isNaN(from) && !isNaN(to)) {
		updatePresence();
		setInterval(updatePresence, 60000);
	}
})();
