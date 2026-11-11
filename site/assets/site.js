/*
 * The only script of the site besides the accessibility panel and the one-line theme loader in the head. It runs the
 * day, night and system theme switch (remembered in localStorage), the copy buttons, the install picker (the exact
 * command for the chosen package runner and agent), the outline that marks the section in view, the chapter drawer on
 * phones, and the search and filters of the rule dictionary from /rules/index.json. Every page works without it.
 */
(function () {
  var root = document.documentElement;
  var status = document.getElementById("live-status");

  function announce(text) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = text;
    }, 50);
  }

  /* Theme: light, dark or system (no saved choice). The head script already applied a saved choice. */
  var THEME_KEY = "fs-theme";
  function savedTheme() {
    try {
      var v = localStorage.getItem(THEME_KEY);
      return v === "light" || v === "dark" ? v : "system";
    } catch (e) {
      return "system";
    }
  }
  function setTheme(mode) {
    try {
      if (mode === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      /* Without storage the choice lasts for this page only. */
    }
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
    document.querySelectorAll("[data-theme-set]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-theme-set") === mode));
    });
  }
  document.querySelectorAll(".theme-switch").forEach(function (group) {
    group.hidden = false;
    group.querySelectorAll("[data-theme-set]").forEach(function (button) {
      button.addEventListener("click", function () {
        setTheme(button.getAttribute("data-theme-set"));
        announce(button.getAttribute("aria-label"));
      });
    });
  });
  setTheme(savedTheme());

  /* Copy buttons. */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      area.remove();
      if (ok) resolve();
      else reject(new Error("copy failed"));
    });
  }
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var source = document.getElementById(button.getAttribute("data-copy"));
    if (!source) return;
    button.hidden = false;
    button.addEventListener("click", function () {
      copyText(source.textContent.trim()).then(
        function () {
          button.setAttribute("data-state", "done");
          announce(button.getAttribute("data-done"));
          window.setTimeout(function () {
            button.removeAttribute("data-state");
          }, 2000);
        },
        function () {
          announce(button.getAttribute("data-fail"));
        }
      );
    });
  });

  /* Install pickers: the command follows the chosen runner and agent; the agent's files are shown by CSS. */
  document.querySelectorAll("[data-install]").forEach(function (box) {
    var runners = box.querySelector("[data-runners]");
    var code = box.querySelector("code[data-args]");
    var note = box.querySelector(".runner-note");
    if (!runners || !code) return;
    runners.hidden = false;
    function update() {
      var runner = box.querySelector('[data-runners] input:checked');
      var agent = box.querySelector('.seg-agents input:checked');
      var args = code.getAttribute("data-args") + (agent && agent.value !== "auto" ? " --agents " + agent.value : "");
      code.textContent = runner.getAttribute("data-template").replace("{args}", args);
      if (note) note.hidden = runner.value === "npx" || runner.value === "pnpm";
    }
    box.addEventListener("change", update);
    update();
  });

  /* Recordings show their still frame while the accessibility panel has animations turned off. */
  var stills = Array.prototype.slice.call(document.querySelectorAll("img[data-still]"));
  if (stills.length) {
    var syncStills = function () {
      var still = root.classList.contains("a11yp-motion");
      stills.forEach(function (img) {
        if (!img.hasAttribute("data-moving")) img.setAttribute("data-moving", img.getAttribute("src"));
        var want = still ? img.getAttribute("data-still") : img.getAttribute("data-moving");
        if (img.getAttribute("src") !== want) img.setAttribute("src", want);
        var source = img.parentNode.tagName === "PICTURE" ? img.parentNode.querySelector("source") : null;
        if (source) source.media = still ? "not all" : "(prefers-reduced-motion: reduce)";
      });
    };
    new MutationObserver(syncStills).observe(root, { attributes: true, attributeFilter: ["class"] });
    syncStills();
  }

  /* The chapter drawer closes when a link in it is followed. */
  var drawer = document.getElementById("docs-nav");
  if (drawer && typeof drawer.hidePopover === "function") {
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a") && drawer.matches(":popover-open")) drawer.hidePopover();
    });
  }

  /* The outline marks the section in view. */
  var outline = document.querySelector(".docs-outline");
  if (outline && "IntersectionObserver" in window) {
    var links = {};
    outline.querySelectorAll("a[href^='#']").forEach(function (a) {
      links[decodeURIComponent(a.getAttribute("href").slice(1))] = a;
    });
    var current = null;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var a = links[entry.target.id];
          if (!a || a === current) return;
          if (current) current.classList.remove("is-active");
          a.classList.add("is-active");
          current = a;
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    Object.keys(links).forEach(function (id) {
      var target = document.getElementById(id);
      if (target) observer.observe(target);
    });
  }

  /* The dictionary's search and filters. */
  var form = document.getElementById("rule-filters");
  if (!form) return;
  var items = Array.prototype.slice.call(document.querySelectorAll(".rule-rows > li[data-id]"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".rule-group"));
  var count = document.getElementById("rule-count");
  var empty = document.getElementById("rule-empty");
  var fields = { q: form.elements.q, area: form.elements.area, severity: form.elements.severity, check: form.elements.check };
  var text = {};
  var timer = 0;
  items.forEach(function (item) {
    text[item.getAttribute("data-id")] = item.textContent.toLowerCase();
  });

  function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, function (match, key) {
      return key in values ? values[key] : match;
    });
  }

  function apply(speak) {
    var q = fields.q.value.trim().toLowerCase();
    var words = q ? q.split(/\s+/) : [];
    var area = fields.area.value;
    var severity = fields.severity.value;
    var check = fields.check.value;
    var shown = 0;
    items.forEach(function (item) {
      var hay = text[item.getAttribute("data-id")] || "";
      var match =
        (!area || item.getAttribute("data-a") === area) &&
        (!severity || item.getAttribute("data-s") === severity) &&
        (!check || item.getAttribute("data-c") === check) &&
        words.every(function (w) {
          return hay.indexOf(w) !== -1;
        });
      item.hidden = !match;
      if (match) shown++;
    });
    groups.forEach(function (group) {
      group.hidden = !group.querySelector(".rule-rows > li:not([hidden])");
    });
    var filtered = words.length || area || severity || check;
    var message = filtered
      ? fill(form.getAttribute("data-count"), { shown: shown, total: items.length })
      : fill(form.getAttribute("data-count-all"), { total: items.length });
    count.textContent = message;
    empty.hidden = shown !== 0;
    if (speak) announce(message);
    var params = new URLSearchParams();
    if (q) params.set("q", fields.q.value.trim());
    if (area) params.set("area", area);
    if (severity) params.set("severity", severity);
    if (check) params.set("check", check);
    var query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : "") + location.hash);
  }

  function later() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      apply(true);
    }, 300);
  }

  /* The index adds what the rows do not show (the skill, the file kinds, the axe and Lighthouse ids) to the search. */
  fetch(form.getAttribute("data-index"))
    .then(function (response) {
      return response.ok ? response.json() : null;
    })
    .then(function (index) {
      if (!index || !index.rules) return;
      index.rules.forEach(function (rule) {
        text[rule.id] =
          (text[rule.id] || "") +
          " " +
          [rule.id, rule.title, rule.area, rule.skill, (rule.wcag || []).join(" "), (rule.applies || []).join(" "), (rule.tools || []).join(" ")].join(" ").toLowerCase();
      });
      if (fields.q.value) apply(false);
    })
    .catch(function () {
      /* Without the index the search still matches the text in the rows. */
    });

  var params = new URLSearchParams(location.search);
  Object.keys(fields).forEach(function (key) {
    var value = params.get(key);
    if (value) fields[key].value = value;
  });
  form.hidden = false;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    apply(true);
  });
  fields.q.addEventListener("input", later);
  ["area", "severity", "check"].forEach(function (key) {
    fields[key].addEventListener("change", function () {
      apply(true);
    });
  });
  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      apply(true);
    }, 0);
  });
  apply(false);
})();
