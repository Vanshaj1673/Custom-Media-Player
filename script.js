function initVideoPlayer(config) {

  const video = document.querySelector(config.videoElement);
  const wrapper = document.querySelector(config.container);

  if (!video || !wrapper) {
    console.error("Video or wrapper not found");
    return;
  }

  video.controls = false;

  
  const controls = document.createElement("div");
  controls.className = "vp-controls";

  controls.innerHTML = `
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

    <button class="vp-btn fullscreen-btn">
      <svg class="vp-icon" viewBox="0 0 24 24">
        <polyline points="4 9 4 4 9 4"></polyline>
        <polyline points="15 4 20 4 20 9"></polyline>
        <polyline points="20 15 20 20 15 20"></polyline>
        <polyline points="9 20 4 20 4 15"></polyline>
      </svg>
    </button>
  `;

  wrapper.appendChild(controls);

  video.muted = true;
  video.volume = config.defaults?.volume || 0.8;
  video.playbackRate = config.defaults?.speed || 1;

  let lastVolume = video.volume;
  let hideTimer = null;


  const playBtn = controls.querySelector(".play-btn");
  const playIcon = controls.querySelector(".play");
  const pauseIcon = controls.querySelector(".pause");

  const progress = controls.querySelector(".progress");
  const time = controls.querySelector(".time");

  const muteBtn = controls.querySelector(".mute-btn");
  const volumeOnIcon = controls.querySelector(".volume-on");
  const volumeOffIcon = controls.querySelector(".volume-off");
  const volumeSlider = controls.querySelector(".volume");

  const speedSelect = controls.querySelector(".speed");
  const fullscreenBtn = controls.querySelector(".fullscreen-btn");

  volumeSlider.value = video.volume;
  speedSelect.value = video.playbackRate;

 
  function isFullscreen() {
    return document.fullscreenElement === wrapper;
  }

  function showControls() {
    controls.classList.remove("hide");

    if (isFullscreen()) return;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused) {
        controls.classList.add("hide");
      }
    }, 2000);
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  playBtn.addEventListener("click", () => {
    video.paused ? video.play() : video.pause();
  });

  video.addEventListener("play", () => {
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    showControls();
  });

  video.addEventListener("pause", () => {
    pauseIcon.classList.add("hidden");
    playIcon.classList.remove("hidden");
    controls.classList.remove("hide");
  });

  video.addEventListener("dblclick", () => {
    video.paused ? video.play() : video.pause();
  });

 
  video.addEventListener("loadedmetadata", () => {
    time.textContent = `00:00 / ${formatTime(video.duration)}`;
  });

  video.addEventListener("timeupdate", () => {
    progress.value = (video.currentTime / video.duration) * 100;
    time.textContent =
      `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });

  progress.addEventListener("input", () => {
    video.currentTime = (progress.value / 100) * video.duration;
  });

 
  volumeSlider.addEventListener("input", () => {
    video.muted = false;
    video.volume = volumeSlider.value;
    lastVolume = video.volume;

    volumeOffIcon.classList.add("hidden");
    volumeOnIcon.classList.remove("hidden");
  });

  muteBtn.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      video.volume = lastVolume;
      volumeSlider.value = video.volume;

      volumeOffIcon.classList.add("hidden");
      volumeOnIcon.classList.remove("hidden");
    } else {
      video.muted = true;

      volumeOnIcon.classList.add("hidden");
      volumeOffIcon.classList.remove("hidden");
    }
  });


  speedSelect.addEventListener("change", () => {
    video.playbackRate = speedSelect.value;
  });

 
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen({ navigationUI: "hide" });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    controls.classList.remove("hide");
  });

  wrapper.addEventListener("mousemove", showControls);
  wrapper.addEventListener("click", showControls);
}


window.initVideoPlayer = initVideoPlayer;
