/* Bayanihan demo — shared interactivity */
(function () {
  "use strict";

  /* ---------------- Search overlay ---------------- */

  var SEARCH_INDEX = [
    { kind: "Page", title: "Home", url: "index.html" },
    { kind: "Page", title: "Issues", url: "issues.html" },
    { kind: "Page", title: "Blogs and Works", url: "blogs.html" },
    { kind: "Page", title: "Artist Community", url: "artists.html" },
    { kind: "Page", title: "Our Team", url: "team.html" },
    { kind: "Issue", title: "Issue 02 — A Celebration of the Philippines’ Iconic Blooms", url: "issues.html" },
    { kind: "Issue", title: "Issue 01 — Perspectives of the Filipino Diaspora", url: "issue-detail.html" },
    { kind: "Blog", title: "Traveling as a Way of Self-discovery and Progress", url: "blog-post.html?post=traveling" },
    { kind: "Blog", title: "How does Writing Influence Your Personal Brand?", url: "blog-post.html?post=writing" },
    { kind: "Blog", title: "Helping a Local Business Reinvent Itself", url: "blog-post.html?post=business" },
    { kind: "Artist", title: "Ramon Santos — designer, photographer, fashion", url: "artists.html" },
    { kind: "Artist", title: "Althea Reyes — designer, fashion", url: "artists.html" },
    { kind: "Artist", title: "Miguel Dela Cruz — photographer, fashion", url: "artists.html" }
  ];

  var overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.innerHTML =
    '<div class="search-modal" role="dialog" aria-modal="true" aria-label="Search">' +
    '  <div class="field">' +
    '    <input type="text" id="overlay-search-input" placeholder="Search for our latest issue..." autocomplete="off">' +
    '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#494b40" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>' +
    "  </div>" +
    '  <div class="search-results" hidden></div>' +
    '  <div class="suggested"><b>Suggested:</b>' +
    '    <a class="chip chip--tag" href="blogs.html">Blogs</a>' +
    '    <a class="chip chip--tag" href="artists.html">Artist Community</a>' +
    '    <a class="chip chip--tag" href="team.html">Our Team</a>' +
    "  </div>" +
    "</div>";
  document.body.appendChild(overlay);

  var overlayInput = overlay.querySelector("input");
  var resultsBox = overlay.querySelector(".search-results");

  function openSearch() {
    overlay.classList.add("open");
    overlayInput.value = "";
    resultsBox.hidden = true;
    setTimeout(function () { overlayInput.focus(); }, 30);
  }

  function closeSearch() {
    overlay.classList.remove("open");
  }

  document.querySelectorAll(".search-box").forEach(function (box) {
    box.addEventListener("click", openSearch);
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
  });

  overlayInput.addEventListener("input", function () {
    var q = overlayInput.value.trim().toLowerCase();
    if (!q) { resultsBox.hidden = true; return; }
    var hits = SEARCH_INDEX.filter(function (item) {
      return item.title.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
    resultsBox.hidden = false;
    resultsBox.innerHTML = hits.length
      ? hits.map(function (h) {
          return '<a href="' + h.url + '"><span class="kind">' + h.kind + "</span>" + h.title + "</a>";
        }).join("")
      : '<div class="empty">No matches — try “blooms”, “diaspora”, or an artist’s name.</div>';
  });

  /* ---------------- Hearts (persisted) ---------------- */

  var LIKES_KEY = "bayanihan-likes";
  var likes = {};
  try { likes = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}"); } catch (e) { likes = {}; }

  function bindHearts(root) {
    (root || document).querySelectorAll(".heart-btn[data-like]").forEach(function (btn) {
      var id = btn.getAttribute("data-like");
      if (likes[id]) btn.classList.add("liked");
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", function () {
        btn.classList.toggle("liked");
        likes[id] = btn.classList.contains("liked");
        try { localStorage.setItem(LIKES_KEY, JSON.stringify(likes)); } catch (e) {}
      });
    });
  }
  bindHearts();

  /* ---------------- Subscribe form ---------------- */

  document.querySelectorAll(".subscribe-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input");
      if (!input.value || input.value.indexOf("@") === -1) {
        input.focus();
        input.setCustomValidity("Please enter a valid email address");
        input.reportValidity();
        setTimeout(function () { input.setCustomValidity(""); }, 1600);
        return;
      }
      form.classList.add("done");
    });
  });

  /* ---------------- Artist tag filter (artists.html) ---------------- */

  var artistPanel = document.querySelector(".artist-panel");
  if (artistPanel) {
    var activeTag = null;
    function applyFilter() {
      artistPanel.querySelectorAll(".artist-card").forEach(function (card) {
        var tags = card.getAttribute("data-tags").split(" ");
        card.style.display = !activeTag || tags.indexOf(activeTag) !== -1 ? "" : "none";
      });
      document.querySelectorAll(".chip--tag[data-filter]").forEach(function (chip) {
        chip.classList.toggle("active", chip.getAttribute("data-filter") === activeTag);
      });
    }
    document.querySelectorAll(".chip--tag[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var tag = chip.getAttribute("data-filter");
        activeTag = activeTag === tag ? null : tag;
        applyFilter();
      });
    });
  }

  /* ---------------- Artist contact buttons ---------------- */

  document.querySelectorAll(".contact-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      var original = btn.textContent;
      btn.textContent = "Request sent ✓";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 2200);
    });
  });

  /* ---------------- Comments (issue-detail.html) ---------------- */

  var commentList = document.getElementById("comment-list");
  if (commentList) {
    var COMMENTS_KEY = "bayanihan-comments";
    var seeded = [
      { name: "Rihanna Josephine", when: "Added 2 mins ago", avatar: "assets/comment-rihanna.jpg", id: "c-rihanna",
        text: "Such great reads and beautiful design! Can’t wait to see what you publish next. ;>" },
      { name: "Jerome Patrick Lopez", when: "Added 1 hour ago", avatar: "assets/comment-jerome.jpg", id: "c-jerome",
        text: "Pure energy! The cover looks so polished, and the content mixes local culture with an international outlook. Loved the short piece on sustainable fashion. I’m so proud of these young creators. Can’t wait for the next issue!" },
      { name: "Ethan Rafael Diaz", when: "Added 4 hours ago", avatar: "assets/comment-ethan.jpg", id: "c-ethan",
        text: "Absolutely loving this! The layout is adventurous, and the models and locations feel genuine and relatable. The photos and styling tell real stories. Hope more brands step up to support the team so they can keep producing work at this level." }
    ];
    var stored = [];
    try { stored = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]"); } catch (e) { stored = []; }

    function commentCard(c) {
      var div = document.createElement("div");
      div.className = "comment-card";
      var avatar = c.avatar
        ? '<img src="' + c.avatar + '" alt="">'
        : '<div class="avatar-initial">' + c.name.charAt(0).toUpperCase() + "</div>";
      div.innerHTML =
        '<div class="comment-head">' + avatar +
        '  <div><div class="who">' + c.name + '</div><div class="when">' + c.when + "</div></div>" +
        '  <button class="heart-btn" data-like="' + c.id + '" aria-label="Like comment">' +
        '    <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" fill="none"><path class="fill" d="M12 21s-7.5-4.7-10-9.3C.6 8.6 2.6 5 6.1 5c2.1 0 3.7 1.1 4.6 2.7L12 9l1.3-1.3C14.2 6.1 15.8 5 17.9 5c3.5 0 5.5 3.6 4.1 6.7C19.5 16.3 12 21 12 21z"/></svg>' +
        "  </button></div>" +
        '<div class="comment-body">' + c.text + "</div>";
      return div;
    }

    function esc(s) {
      var d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }

    stored.concat(seeded).forEach(function (c) { commentList.appendChild(commentCard(c)); });
    bindHearts(commentList);

    var composer = document.getElementById("comment-form");
    composer.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = composer.querySelector("input");
      var text = input.value.trim();
      if (!text) { input.focus(); return; }
      var c = { name: "You", when: "Added just now", avatar: null, id: "c-" + Date.now(), text: esc(text) };
      stored.unshift(c);
      try { localStorage.setItem(COMMENTS_KEY, JSON.stringify(stored)); } catch (err) {}
      commentList.insertBefore(commentCard(c), commentList.firstChild);
      bindHearts(commentList);
      input.value = "";
    });
  }

  /* ---------------- Blog post switcher (blog-post.html) ---------------- */

  var articleEl = document.getElementById("article");
  if (articleEl) {
    var POSTS = {
      traveling: {
        title: "Traveling as a Way of Self-discovery and Progress",
        hero: "assets/blog-hero-traveling.jpg",
        tags: ["DIY", "Book", "Current Event"],
        when: "5 mins ago"
      },
      writing: {
        title: "How does Writing Influence Your Personal Brand?",
        hero: "assets/blog-writing.jpg",
        tags: ["Current Event"],
        when: "5 hours ago"
      },
      business: {
        title: "Helping a Local Business Reinvent Itself",
        hero: "assets/blog-business.jpg",
        tags: ["Book"],
        when: "1 day ago"
      }
    };
    var key = new URLSearchParams(location.search).get("post");
    var post = POSTS[key] || POSTS.traveling;
    articleEl.querySelector("h1").textContent = post.title;
    articleEl.querySelector(".hero").src = post.hero;
    articleEl.querySelector(".hero").alt = post.title;
    articleEl.querySelector(".when").textContent = post.when;
    document.title = post.title + " · Bayanihan";
    var tagsBox = articleEl.querySelector(".tags");
    tagsBox.innerHTML = post.tags.map(function (t) {
      return '<span class="chip">' + t + "</span>";
    }).join(" ");
  }
})();
