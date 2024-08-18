// client
"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import {
  ArrowsPointingOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/20/solid";

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string; // Optional thumbnail
}

export function VideoPlayer({
  title,
  videoUrl,
  thumbnailUrl,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreenChange = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        if (videoRef.current.requestFullscreen) {
          return videoRef.current.requestFullscreen();
        }

        if (isPlaying) {
          return (videoRef.current as any).webkitEnterFullscreen();
        }

        togglePlay();

        setTimeout(() => {
          (videoRef.current as any).webkitEnterFullscreen();
        }, 500);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef.current?.duration]);

  useEffect(() => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  }, [videoRef.current?.muted]);

  // UseEffect to track play and pause events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);

      // Clean up event listeners on unmount
      return () => {
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
      };
    }
  }, []);

  return (
    <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg">
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-4 text-lg text-white">
        <div className="line-clamp-1">{title}</div>
      </div>
      <video
        ref={videoRef}
        className="w-full"
        controls={false}
        playsInline
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        poster={thumbnailUrl}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{ background: "transparent" }}
      ></div>
      <div className="absolute inset-x-0 bottom-0 z-20 grid gap-2 bg-gradient-to-b from-transparent to-black/50">
        <div className="mb-0.5 px-3">
          <Slider progress={(currentTime / duration) * 100} />
        </div>
        <div className="flex items-center gap-3 p-3 pt-0 text-white [&_svg]:text-white">
          <Button onClick={togglePlay}>
            {isPlaying ? (
              <PauseIcon className="h-5 fill-white" />
            ) : (
              <PlayIcon className="h-5 fill-white" />
            )}
          </Button>
          <Button onClick={toggleMute}>
            {isMuted ? (
              <SpeakerXMarkIcon className="h-5 fill-white" />
            ) : (
              <SpeakerWaveIcon className="h-5 fill-white" />
            )}
          </Button>
          <div className="text-sm">
            {formatTime(currentTime)} /{" "}
            {duration ? formatTime(duration) : "--:--"}
          </div>
          <Button
            onClick={handleFullscreenChange}
            className="ml-auto hover:bg-black/50"
          >
            <ArrowsPointingOutIcon className="h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SliderProps {
  progress: number;
}

export function Slider({ progress }: SliderProps) {
  return (
    <div className="flex flex-auto cursor-pointer rounded-full bg-slate-100">
      <div
        className="h-1 rounded-l-full rounded-r-[1px] bg-indigo-600"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
