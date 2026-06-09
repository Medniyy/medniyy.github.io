const SEGMENT_SEC     = 4;      // seconds each video clip plays before rotating
const BOOT_STAGGER_MS = 1800;   // delay between each screen lighting up
const BOOT_FADE_MS    = 1200;   // matches CSS filter transition duration

// ── Sequential video order ───────────────────────────────────────────────────
// Each screen gets its own cursor that steps by the total number of screens,
// so the playback order across all screens follows videos.json top-to-bottom.
// Screen 0: videos  0, N, 2N ...
// Screen 1: videos  1, N+1, 2N+1 ...
// Screen 2: videos  2, N+2, 2N+2 ...

function makeNextVideo(startIdx, step, pool) {
  let idx = startIdx;
  return function nextVideo() {
    const item = pool[idx % pool.length];
    idx += step;
    return item;
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clearTimer(screen) {
  if (screen.segmentTimer) {
    clearTimeout(screen.segmentTimer);
    screen.segmentTimer = null;
  }
}

function waitMeta(video) {
  if (video.readyState >= 1 && Number.isFinite(video.duration)) {
    return Promise.resolve(video.duration);
  }
  return new Promise((resolve) => {
    const done = () => resolve(Number.isFinite(video.duration) ? video.duration : 30);
    video.addEventListener("loadedmetadata", done, { once: true });
    video.addEventListener("error",          done, { once: true });
    setTimeout(done, 4000);
  });
}

async function loadSource(video, src) {
  if (video.dataset.src === src) return;
  video.dataset.src = src;
  video.src = src;
  await waitMeta(video);
}

// ── Playback ─────────────────────────────────────────────────────────────────

async function playSegment(screen) {
  if (screen.mode !== "segment") return;
  clearTimer(screen);

  const item = screen.nextVideo();
  const video = screen.video;

  try {
    await loadSource(video, item.src);
  } catch {
    screen.segmentTimer = setTimeout(() => playSegment(screen), 800);
    return;
  }

  screen.currentItem = item;
  const dur = await waitMeta(video);
  const maxStart = Math.max(0, dur - SEGMENT_SEC - 0.1);
  const start = maxStart > 0 ? Math.random() * maxStart : 0;

  video.muted = true;
  try { video.currentTime = start; } catch { /* seek race */ }
  try { await video.play(); } catch { /* autoplay blocked */ }

  screen.segmentTimer = setTimeout(() => {
    if (screen.mode === "segment") playSegment(screen);
  }, SEGMENT_SEC * 1000);
}

// ── Poster preload ────────────────────────────────────────────────────────────
// Fast path: set src + seek, add has-poster immediately — don't block on seeked.

async function preloadPoster(screen) {
  const item = screen.nextVideo();
  const video = screen.video;
  video.muted = true;
  video.src   = item.src;
  video.dataset.src = item.src;

  try {
    const dur = await Promise.race([
      waitMeta(video),
      new Promise((r) => setTimeout(() => r(30), 1500)),
    ]);
    video.currentTime = Math.min(1.5, dur * 0.12);
  } catch { /* fine — browser will show first decodable frame */ }

  screen.currentItem = item;
  screen.el.classList.add("has-poster");
}

// ── Init ──────────────────────────────────────────────────────────────────────

export async function initTvWall({ stageEl, glowEl, pool, layout }) {
  const sorted = [...layout].sort((a, b) => a.order - b.order);
  const N = sorted.length;

  stageEl.innerHTML = "";
  if (glowEl) glowEl.innerHTML = "";

  const screens = sorted.map((cfg, i) => {
    // Video div
    const wrap = document.createElement("div");
    wrap.className = "tv-screen";
    wrap.style.left   = cfg.left;
    wrap.style.top    = cfg.top;
    wrap.style.width  = cfg.width;
    wrap.style.height = cfg.height;
    wrap.dataset.orientation = cfg.orientation;
    wrap.dataset.screenId    = cfg.id;

    const video = document.createElement("video");
    video.className  = "tv-video";
    video.muted      = true;
    video.playsInline = true;
    video.preload    = "auto";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    wrap.appendChild(video);
    stageEl.appendChild(wrap);

    // Glow div — large soft blob centered on this screen, sits above overlay
    let glowDiv = null;
    if (glowEl) {
      const l = parseFloat(cfg.left);
      const t = parseFloat(cfg.top);
      const w = parseFloat(cfg.width);
      const h = parseFloat(cfg.height);
      glowDiv = document.createElement("div");
      glowDiv.className   = "tv-screen-glow";
      glowDiv.style.left  = `${l + w / 2}%`;
      glowDiv.style.top   = `${t + h / 2}%`;
      glowDiv.style.width  = `${w * 3.8}%`;
      glowDiv.style.height = `${h * 3.8}%`;
      glowEl.appendChild(glowDiv);
    }

    return {
      el:        wrap,
      video,
      glowDiv,
      mode:      "boot",
      segmentTimer: null,
      currentItem:  null,
      // Sequential cursor: screen i uses videos i, i+N, i+2N …
      nextVideo: makeNextVideo(i, N, pool),
    };
  });

  const destroy = () => {
    screens.forEach((s) => {
      clearTimer(s);
      s.video.pause();
      s.video.removeAttribute("src");
      s.video.load();
    });
    stageEl.innerHTML = "";
    if (glowEl) glowEl.innerHTML = "";
  };

  // Step 1 — preload poster frames for ALL screens in parallel (fast)
  await Promise.all(screens.map((s) => preloadPoster(s)));

  // Step 2 — light them up one by one (all timers fire simultaneously)
  await Promise.all(
    screens.map((screen, i) =>
      new Promise((resolve) => {
        setTimeout(() => {
          screen.el.classList.remove("has-poster");
          screen.el.classList.add("is-on");
          if (screen.glowDiv) screen.glowDiv.classList.add("glow-on");
          screen.mode = "segment";
          playSegment(screen);
          setTimeout(resolve, BOOT_FADE_MS);
        }, i * BOOT_STAGGER_MS);
      })
    )
  );

  return { screens, destroy };
}
