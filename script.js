function initVideoPlayer(cfg) {
  const video = document.querySelector(cfg.videoElement);
  const box = document.querySelector(cfg.container);

  if (!video || !box) {
    console.error("Missing video or container");
    return;
  }

  video.controls = false;

  const ui = document.createElement("div");
  ui.className = "vp-controls";

  ui.innerHTML = `
    <button class="vp-btn play-btn">
      <svg class="vp-icon play" viewBox="0 0 24 24">
        <polygon points="5,3 19,12 5,21"></polygon>
      </svg>
      <svg class="vp-icon pause hidden" viewBox="0 0 24 24">
        <rect x="5" y="3" width="5" height="18"></rect>
        <rect x="14" y="3" width="5" height="18"></rect>
      </svg>
    </button>

    <input type="range" class="progress" min="0" max="100" value="0" />

    <span class="time">00:00 / 00:00</span>

    <button class="vp-btn mute-btn">
      <svg class="vp-icon volume-off" viewBox="0 0 24 24">
        <polygon points="3,9 7,9 12,4 12,20 7,15 3,15"></polygon>
        <line x1="16" y1="8" x2="22" y2="16" stroke="white" stroke-width="2"/>
        <line x1="22" y1="8" x2="16" y2="16" stroke="white" stroke-width="2"/>
      </svg>
      <svg class="vp-icon volume-on hidden" viewBox="0 0 24 24">
        <polygon points="3,9 7,9 12,4 12,20 7,15 3,15"></polygon>
        <path d="M16 8a4 4 0 0 1 0 8"
              fill="none"
              stroke="white"
              stroke-width="2"/>
      </svg>
    </button>

    <input type="range" class="volume" min="0" max="1" step="0.01" />

    <select class="speed">
      <option value="0.5">0.5x</option>
      <option value="1">1x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="2">2x</option>
    </select>

    <button class="vp-btn fs-btn">
      <svg class="vp-icon" viewBox="0 0 24 24">
        <polyline points="4 9 4 4 9 4"></polyline>
        <polyline points="15 4 20 4 20 9"></polyline>
        <polyline points="20 15 20 20 15 20"></polyline>
        <polyline points="9 20 4 20 4 15"></polyline>
      </svg>
    </button>
  `;

  box.appendChild(ui);

  video.muted = true;
  video.volume = cfg.defaults?.volume || 0.8;
  video.playbackRate = cfg.defaults?.speed || 1;

  let lastVol = video.volume;
  let hideT = null;

  const playBtn = ui.querySelector(".play-btn");
  const playI = ui.querySelector(".play");
  const pauseI = ui.querySelector(".pause");

  const bar = ui.querySelector(".progress");
  const time = ui.querySelector(".time");

  const muteBtn = ui.querySelector(".mute-btn");
  const volOn = ui.querySelector(".volume-on");
  const volOff = ui.querySelector(".volume-off");
  const vol = ui.querySelector(".volume");

  const speed = ui.querySelector(".speed");
  const fsBtn = ui.querySelector(".fs-btn");

  vol.value = video.volume;
  speed.value = video.playbackRate;

  function isFs() {
    return document.fullscreenElement === box;
  }

  function showUi() {
    ui.classList.remove("hide");

    if (isFs()) return;

    clearTimeout(hideT);
    hideT = setTimeout(() => {
      if (!video.paused) ui.classList.add("hide");
    }, 2000);
  }

  function fmt(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  playBtn.addEventListener("click", () => {
    video.paused ? video.play() : video.pause();
  });

  video.addEventListener("play", () => {
    playI.classList.add("hidden");
    pauseI.classList.remove("hidden");
    showUi();
  });

  video.addEventListener("pause", () => {
    pauseI.classList.add("hidden");
    playI.classList.remove("hidden");
    ui.classList.remove("hide");
  });

  video.addEventListener("dblclick", () => {
    video.paused ? video.play() : video.pause();
  });

  video.addEventListener("loadedmetadata", () => {
    time.textContent = `00:00 / ${fmt(video.duration)}`;
  });

  video.addEventListener("timeupdate", () => {
    bar.value = (video.currentTime / video.duration) * 100;
    time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  });

  bar.addEventListener("input", () => {
    video.currentTime = (bar.value / 100) * video.duration;
  });

  vol.addEventListener("input", () => {
    video.muted = false;
    video.volume = vol.value;
    lastVol = video.volume;

    volOff.classList.add("hidden");
    volOn.classList.remove("hidden");
  });

  muteBtn.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      video.volume = lastVol;
      vol.value = video.volume;

      volOff.classList.add("hidden");
      volOn.classList.remove("hidden");
    } else {
      video.muted = true;

      volOn.classList.add("hidden");
      volOff.classList.remove("hidden");
    }
  });

  speed.addEventListener("change", () => {
    video.playbackRate = speed.value;
  });

  fsBtn.addEventListener("click", () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : box.requestFullscreen({ navigationUI: "hide" });
  });

  document.addEventListener("fullscreenchange", () => {
    ui.classList.remove("hide");
  });

  box.addEventListener("mousemove", showUi);
  box.addEventListener("click", showUi);
}

window.initVideoPlayer = initVideoPlayer;

