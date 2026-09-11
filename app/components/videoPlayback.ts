import { useEffect, useRef, type RefObject } from "react";

type PlaybackController = {
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

const controllers = new WeakMap<HTMLVideoElement, PlaybackController>();

/** Own playback for both native video and the canvas's hidden source video. */
export function observeVideoPlayback(
  video: HTMLVideoElement,
  target: Element,
  initiallyPaused: boolean,
  onPlaybackChange?: (playing: boolean) => void,
): PlaybackController {
  let paused = initiallyPaused;
  let disposed = false;
  let visible = false;
  let starting = false;
  const shouldPlay = () => !disposed && visible && !paused && !document.hidden;

  const sync = () => {
    if (!shouldPlay()) {
      video.pause();
      onPlaybackChange?.(false);
      return;
    }
    if (!video.paused || starting) return;
    starting = true;
    let interrupted = false;
    void video.play().then(() => {
      if (!disposed && !shouldPlay()) video.pause();
    }).catch((error: unknown) => {
      interrupted = error instanceof Error && error.name === "AbortError";
      if (!disposed) onPlaybackChange?.(false);
    }).finally(() => {
      starting = false;
      // A hide/show can interrupt a pending play. Policy denials need a click.
      if (interrupted && shouldPlay()) sync();
    });
  };
  const playing = () => {
    if (shouldPlay()) onPlaybackChange?.(true);
    else video.pause();
  };
  const stopped = () => onPlaybackChange?.(false);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    // Decode a still frame even when motion is disabled or autoplay is blocked.
    if (visible && video.preload === "none") {
      video.preload = "auto";
      video.load();
    }
    sync();
  });

  const controller: PlaybackController = {
    setPaused(value) {
      paused = value;
      sync();
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("playing", playing);
      video.removeEventListener("pause", stopped);
      video.removeEventListener("error", stopped);
      video.removeEventListener("canplay", sync);
      controllers.delete(video);
      video.pause();
    },
  };
  controllers.set(video, controller);
  document.addEventListener("visibilitychange", sync);
  video.addEventListener("playing", playing);
  video.addEventListener("pause", stopped);
  video.addEventListener("error", stopped);
  video.addEventListener("canplay", sync);
  observer.observe(target);

  return controller;
}

/** Apply intent during the click gesture, before requesting browser playback. */
export function requestVideoPlayback(video: HTMLVideoElement, paused: boolean) {
  controllers.get(video)?.setPaused(paused);
}

export function useVideoPlayback({
  videoRef,
  targetRef,
  src,
  paused,
  onPlaybackChange,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  targetRef: RefObject<HTMLElement | null>;
  src: string;
  paused: boolean;
  onPlaybackChange?: (playing: boolean) => void;
}) {
  const controllerRef = useRef<PlaybackController | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const target = targetRef.current;
    if (!video || !target) return;
    const controller = observeVideoPlayback(video, target, true, onPlaybackChange);
    controllerRef.current = controller;
    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [videoRef, targetRef, src, onPlaybackChange]);

  useEffect(() => {
    controllerRef.current?.setPaused(paused);
  }, [paused, src, videoRef, targetRef, onPlaybackChange]);
}
