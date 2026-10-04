/**
 * Studio Code for JAV
 *
 * 1) Grid view: displays the studio code at the bottom-right corner of each
 *    scene card.
 * 2) List view: adds a "编号" column between the cover image column and the
 *    title column, showing the same label.
 *
 * Label priority: scene.code -> studio.name -> "(Unknown)".
 *
 * Pure DOM injection via MutationObserver — no React patching.
 */
(function () {
  "use strict";

  var TAG = "[StudioCodeForJAV]";
  var BADGE_CLASS = "studio-code-for-jav";
  var BADGE_UNKNOWN_CLASS = "studio-code-unknown";
  var COL_HEAD_CLASS = "scj-col-head";
  var COL_DATA_CLASS = "scj-col-data";
  var COL_LABEL = "编号";

  function log() {
    console.log.apply(console, [TAG].concat(Array.prototype.slice.call(arguments)));
  }

  // ─── Scene label data ───

  var labelCache = new Map();
  var pendingIds = new Set();
  var fetchTimer = null;
  var scheduledRefresh = false;

  function getSceneId(container) {
    var link = container.querySelector('a[href*="/scenes/"]');
    if (!link) return null;
    var match = (link.getAttribute("href") || "").match(/\/scenes\/(\d+)/);
    return match ? match[1] : null;
  }

  function resolveLabel(scene) {
    if (scene.code && typeof scene.code === "string" && scene.code.trim() !== "") {
      return scene.code.trim();
    }
    if (
      scene.studio &&
      scene.studio.name &&
      typeof scene.studio.name === "string" &&
      scene.studio.name.trim() !== ""
    ) {
      return scene.studio.name.trim();
    }
    return "(Unknown)";
  }

  function scheduleFetch() {
    if (fetchTimer) return;
    fetchTimer = setTimeout(runFetch, 120);
  }

  function fetchScenes(ids) {
    return fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        query:
          "query ($ids: [ID!]) { findScenes(ids: $ids) { scenes { id code studio { name } } } }",
        variables: { ids: ids },
      }),
    })
      .then(function (res) { return res.json(); })
      .then(function (payload) {
        if (payload.errors || !payload.data || !payload.data.findScenes) {
          throw new Error(payload.errors ? payload.errors[0].message : "empty data");
        }
        return payload.data.findScenes.scenes || [];
      });
  }

  function applyScenes(scenes) {
    scenes.forEach(function (s) {
      labelCache.set(String(s.id), resolveLabel(s));
    });
  }

  function runFetch() {
    fetchTimer = null;
    var ids = [];
    pendingIds.forEach(function (id) {
      if (!labelCache.has(id)) ids.push(id);
    });
    pendingIds.clear();
    if (ids.length === 0) return;

    fetchScenes(ids)
      .then(function (scenes) {
        applyScenes(scenes);
        scheduleRefresh();
      })
      .catch(function (batchErr) {
        log("batch query failed, retrying per-id:", batchErr.message);
        Promise.all(
          ids.map(function (id) {
            return fetchScenes([id])
              .then(function (scenes) {
                applyScenes(scenes);
              })
              .catch(function () {
                labelCache.set(id, "(Unknown)");
              });
          })
        ).then(scheduleRefresh);
      });
  }

  // ─── Grid view (scene cards) ───

  function decorateCard(card) {
    if (!card.isConnected) return;

    var id = getSceneId(card);
    if (!id) return;

    if (!labelCache.has(id)) {
      pendingIds.add(id);
      scheduleFetch();
      return;
    }

    var label = labelCache.get(id);
    var isUnknown = label === "(Unknown)";

    var badge = card.querySelector(":scope > ." + BADGE_CLASS);
    if (!badge) {
      badge = document.createElement("div");
      badge.className = BADGE_CLASS;
      card.appendChild(badge);
    }
    if (badge.textContent !== label) badge.textContent = label;
    if (isUnknown) {
      badge.classList.add(BADGE_UNKNOWN_CLASS);
    } else {
      badge.classList.remove(BADGE_UNKNOWN_CLASS);
    }
  }

  // ─── List view (table) ───

  function decorateListHead(table) {
    var headRow = table.querySelector("thead tr");
    if (!headRow) return;

    var titleHead = headRow.querySelector("th.title-head");
    if (!titleHead) return;
    if (headRow.querySelector(":scope > th." + COL_HEAD_CLASS)) return;

    var th = document.createElement("th");
    th.className = COL_HEAD_CLASS;
    th.textContent = COL_LABEL;
    headRow.insertBefore(th, titleHead);
  }

  function decorateListRow(row) {
    if (!row.isConnected) return;
    if (row.querySelector("td.border-row")) return;

    var titleCell = row.querySelector("td.title-data");
    if (!titleCell) return;

    var id = getSceneId(row);
    if (!id) return;

    if (!labelCache.has(id)) {
      pendingIds.add(id);
      scheduleFetch();
      return;
    }

    var label = labelCache.get(id);
    var isUnknown = label === "(Unknown)";

    var cell = row.querySelector(":scope > td." + COL_DATA_CLASS);
    if (!cell) {
      cell = document.createElement("td");
      cell.className = COL_DATA_CLASS;
      row.insertBefore(cell, titleCell);
    }
    if (cell.textContent !== label) cell.textContent = label;
    if (isUnknown) {
      cell.classList.add(BADGE_UNKNOWN_CLASS);
    } else {
      cell.classList.remove(BADGE_UNKNOWN_CLASS);
    }
  }

  // ─── Shared refresh ───

  function refreshAll() {
    document.querySelectorAll(".scene-card").forEach(decorateCard);

    document.querySelectorAll(".table-list").forEach(function (table) {
      decorateListHead(table);
      table.querySelectorAll("tbody tr").forEach(decorateListRow);
    });
  }

  function scheduleRefresh() {
    if (scheduledRefresh) return;
    scheduledRefresh = true;
    requestAnimationFrame(function () {
      scheduledRefresh = false;
      refreshAll();
    });
  }

  // ─── Startup ───

  function start() {
    refreshAll();

    var observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });

    console.log(TAG, "initialized - DOM injection mode (grid + list)");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
