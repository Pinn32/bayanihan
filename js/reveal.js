/* Home page "Swipe To Reveal" — vanilla port of the prototype's React swiper.
   Press/drag over the yellow panel to reveal squares of the hidden issue cover;
   each square fades away after a moment. */
(function () {
  "use strict";

  var panel = document.getElementById("reveal-panel");
  if (!panel) return;

  var IMAGE_SRC = panel.getAttribute("data-image");
  var SQUARE = 108;          // revealed square size, px
  var REVEAL_DIST = 25;      // min drag distance between squares
  var REVEAL_INTERVAL = 150; // ms between reveals while holding still
  var DISAPPEAR = 1000;      // ms before a square fades out

  var cursor = panel.querySelector(".cursor-ring");
  var pointer = { x: 0, y: 0 };
  var lastReveal = { x: 0, y: 0 };
  var isDown = false;
  var holdTimer = null;
  var imgW = 0, imgH = 0, loaded = false;

  var img = new Image();
  img.onload = function () {
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    loaded = true;
  };
  img.src = IMAGE_SRC;

  function coverFit() {
    var pw = panel.clientWidth, ph = panel.clientHeight;
    var scale = Math.max(pw / imgW, ph / imgH);
    var dw = imgW * scale, dh = imgH * scale;
    return { w: dw, h: dh, x: (pw - dw) / 2, y: (ph - dh) / 2 };
  }

  function revealAt(x, y) {
    if (!loaded) return;
    var fit = coverFit();
    var sx = x - SQUARE / 2;
    var sy = y - SQUARE / 2;
    var sq = document.createElement("div");
    sq.className = "square";
    sq.style.left = sx + "px";
    sq.style.top = sy + "px";
    sq.style.width = SQUARE + "px";
    sq.style.height = SQUARE + "px";
    sq.style.backgroundImage = "url('" + IMAGE_SRC + "')";
    sq.style.backgroundSize = fit.w + "px " + fit.h + "px";
    sq.style.backgroundPosition = (fit.x - sx) + "px " + (fit.y - sy) + "px";
    panel.appendChild(sq);
    setTimeout(function () {
      sq.classList.add("fading");
      setTimeout(function () { sq.remove(); }, 500);
    }, DISAPPEAR);
  }

  function localPoint(e) {
    var r = panel.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  panel.addEventListener("pointermove", function (e) {
    pointer = localPoint(e);
    if (cursor) {
      cursor.style.left = pointer.x + "px";
      cursor.style.top = pointer.y + "px";
    }
    if (isDown) {
      var dx = pointer.x - lastReveal.x, dy = pointer.y - lastReveal.y;
      if (Math.sqrt(dx * dx + dy * dy) >= REVEAL_DIST) {
        revealAt(pointer.x, pointer.y);
        lastReveal = pointer;
      }
    }
  });

  panel.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    panel.setPointerCapture(e.pointerId);
    isDown = true;
    pointer = localPoint(e);
    revealAt(pointer.x, pointer.y);
    lastReveal = pointer;
    if (cursor) cursor.style.transform = "translate(-50%,-50%) scale(0.9)";
    holdTimer = setInterval(function () { revealAt(pointer.x, pointer.y); }, REVEAL_INTERVAL);
  });

  function up() {
    isDown = false;
    if (cursor) cursor.style.transform = "translate(-50%,-50%)";
    if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
  }

  panel.addEventListener("pointerup", up);
  panel.addEventListener("pointercancel", up);
  panel.addEventListener("pointerleave", up);
})();
