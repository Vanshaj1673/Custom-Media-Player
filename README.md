Custom Media Player

Working Explained:

*High Level Idea*:Project folder cotains 3 files

1.)index.html:-for just adding the video and its wrapper.
2.)style.css:- for styling the wrapper,video and custom controls.
3.)script.js:-creating the custom UI


HTML Summary:  The video is added through the video tag in HTML but it has no control 
               attribute ,because the idea is to create a custom media player with custom controls.

Also the class video-wrapper exists so thatfull screen can be applied cleanly and controls can come over the video.



CSS Summary:On how things will be shown and also for responsiveness.

JS Summary:

1. Initialization function
   
    .The entire player is created using a single function: initVideoPlayer(cfg)
    .Nothing runs automatically. The player works only when this function is called.
    .This makes the library reusable and configurable.
   

2. Getting required elements

     .The function first selects:
     .The video element
     .The wrapper container
     .If either is missing, the function exits safely.

3. Disabling default video controls

   .Browser default controls are turned off.
   .This ensures only the custom UI is used.

4. Reading configuration options

   .Control settings (volume, fullscreen, playbackSpeed) are read from cfg.controls
   .Controls are created only if they are enabled in the config.

5. Creating the custom UI

    .A controls container (.vp-controls) is created dynamically using JavaScript.
    .All buttons, sliders, and selectors are injected as HTML.
    .The UI is layered on top of the video element.

6. Disabling controls initially

   .Controls start in a disabled state.
   .This prevents user interaction before the video is ready.

7. Applying default settings

   .Default volume and playback speed are applied from configuration.
   .Initial volume is muted to avoid unexpected audio.

8. Internal state tracking

   The script tracks:
     .Last volume value (for mute/unmute)
     .Whether the video was playing before seeking
     .Whether the video metadata has loaded
     .These variables help maintain correct behavior.

9. Formatting time

    .A helper function converts seconds into MM:SS format.
    .This is used for both current time and total duration display.

10. Enabling controls when ready

    .Once video metadata loads:
    .Controls are enabled
    .Duration is displayed
    .This ensures playback starts only when the video is usable.

11. Play / Pause handling

    .Clicking the play button toggles playback.
    .Icons update based on the actual video state.
    .Playback cannot start before the video is ready.

12. Progress bar updates

    .As the video plays, the progress bar updates automatically.
    .Current time and total duration are updated in real time.

13. Seeking behavior

     When the user starts dragging the progress bar:
     Playback pauses
     The previous playback state is remembered

When seeking ends:

.Playback resumes only if it was playing before
.This ensures smooth and predictable seeking.

14. Volume control

.Volume slider changes the video volume.
.Mute button toggles audio without losing the previous volume level.
.Unmuting restores the last known volume.

15. Playback speed control

.Changing the speed selector updates the playback rate immediately.
.Playback continues without resetting.

16. Fullscreen handling

  .Fullscreen mode is toggled using the Fullscreen API.
  .The UI stays visible and synced when exiting fullscreen via keyboard or browser controls.

17. UI auto-hide behavior

  .Controls appear when the user moves the mouse or clicks.
  .Controls auto-hide when the video is playing and the user is idle.
  .Controls remain visible when the video is paused.

18. Clean separation of concerns

  .HTML provides structure
  .CSS handles layout and responsiveness
  .JavaScript controls all behavior and media logic

19. Overall flow summary

   .Video loads
   .Metadata becomes available
   .Controls are enabled
   .User interactions update video state
   .Video events update UI state



               
