/*
 * The only script of the site besides the accessibility panel. It shows the copy buttons next to commands and runs
 * the search and filters of the rule dictionary from /rules/index.json. Every page works without it: commands stay
 * selectable and the dictionary lists every rule.
 */
(function () {
  var status = document.getElementById("live-status");

  function announce(text) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = text;
    }, 50);
  }

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

  var form = document.getElementById("rule-filters");
  if (!form) return;

  var items = Array.prototype.slice.call(document.querySelectorAll(".rule-item[data-id]"));
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
        (!area || item.getAttribute("data-area") === area) &&
        (!severity || item.getAttribute("data-severity") === severity) &&
        (!check || item.getAttribute("data-check") === check) &&
        words.every(function (w) {
          return hay.indexOf(w) !== -1;
        });
      item.hidden = !match;
      if (match) shown++;
    });
    groups.forEach(function (group) {
      group.hidden = !group.querySelector(".rule-item:not([hidden])");
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

  /* The index adds what the cards do not show (the skill, the file kinds, the axe and Lighthouse ids) to the search. */
  fetch(form.getAttribute("data-index"))
    .then(function (response) {
      return response.ok ? response.json() : null;
    })
    .then(function (index) {
      if (!index || !index.rules) return;
      index.rules.forEach(function (rule) {
        text[rule.id] = (text[rule.id] || "") + " " + [rule.id, rule.title, rule.area, rule.skill, (rule.wcag || []).join(" "), (rule.applies || []).join(" "), (rule.tools || []).join(" ")]
          .join(" ")
          .toLowerCase();
      });
      if (fields.q.value) apply(false);
    })
    .catch(function () {
      /* Without the index the search still matches the text on the cards. */
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
