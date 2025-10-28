import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";

interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

// Global player state
let currentTrack: Track | null = null;
let setCurrentTrackState: ((track: Track | null) => void) | null = null;
let setIsPlayingState: ((playing: boolean) => void) | null = null;
let setProgressState: ((progress: number) => void) | null = null;

// Export functions to control player from other components
export const playTrack = (track: Track) => {
  console.log("playTrack called with:", track);
  currentTrack = track;
  if (setCurrentTrackState) {
    console.log("Setting track state");
    setCurrentTrackState(track);
  } else {
    console.log("setCurrentTrackState is null");
  }
  if (setIsPlayingState) {
    console.log("Setting playing state to true");
    setIsPlayingState(true);
  } else {
    console.log("setIsPlayingState is null");
  }
};

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [track, setTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Set global state setters
  useEffect(() => {
    console.log("Player component mounted, setting global state setters");
    setCurrentTrackState = setTrack;
    setIsPlayingState = setIsPlaying;
    setProgressState = setProgress;
  }, []);

  // Debug track changes
  useEffect(() => {
    console.log("Track state changed:", track);
  }, [track]);

  // Auto-play when track changes
  useEffect(() => {
    if (track && audioRef.current) {
      console.log("New track loaded, attempting to play:", track.title);
      const audio = audioRef.current;
      audio.load(); // Reload the audio element with new src
      audio.play().then(() => {
        console.log("Auto-play successful");
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      });
    }
  }, [track]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log("Audio ref is null");
      return;
    }

    try {
      if (isPlaying) {
        console.log("Pausing audio");
        audio.pause();
        setIsPlaying(false);
      } else {
        console.log("Playing audio, src:", audio.src);
        await audio.play();
        console.log("Audio play started");
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (audio.duration) {
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    const newTime = (value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(value);
    console.log("Seeking to:", newTime, "seconds");
  };

  // Don't render if no track is selected
  if (!track) {
    return null;
  }

  return (
    <div className="position-fixed start-0 end-0 bg-white border-top shadow-sm" style={{ zIndex: 1001, bottom: "64px" }}>
      {/* Progress bar bovenaan */}
      <div className="w-100 position-relative" style={{ height: "6px", cursor: "pointer" }}>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-100 position-absolute"
          style={{
            height: "6px",
            background: "transparent",
            outline: "none",
            cursor: "pointer",
            zIndex: 2,
            opacity: 0,
            appearance: "none",
            WebkitAppearance: "none"
          }}
        />
        <div 
          className="position-absolute top-0 start-0" 
          style={{ 
            height: "100%", 
            width: `${progress}%`,
            backgroundColor: "#6c2bd9",
            borderRadius: "3px"
          }}
        />
        <div 
          className="position-absolute top-0 start-0 w-100" 
          style={{ 
            height: "100%", 
            backgroundColor: "#e9ecef",
            borderRadius: "3px"
          }}
        />
      </div>

      {/* Main player content */}
      <div className="d-flex align-items-center px-3 py-2">
        {/* Album art links */}
        <div className="me-3">
          <img
            src={track.cover}
            alt={track.title}
            className="rounded"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </div>

        {/* Track info midden */}
        <div className="flex-grow-1 me-3">
          <h6 className="mb-0 fw-bold text-dark">{track.title}</h6>
          <small className="text-muted">{track.artist}</small>
          <div className="d-flex align-items-center gap-2 mt-1">
            <small className="text-muted">{formatTime(currentTime)}</small>
            <small className="text-muted">/</small>
            <small className="text-muted">{formatTime(duration)}</small>
          </div>
        </div>

        {/* Playback controls rechts */}
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-link p-1 text-dark"
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = Math.max(0, audio.currentTime - 10);
                console.log("Skipped back 10 seconds");
              }
            }}
            title="Skip back 10 seconds"
          >
            <IoPlaySkipBack size={20} />
          </button>

          <button 
            onClick={togglePlay} 
            className="btn rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#6c2bd9",
              border: "none",
              width: "40px",
              height: "40px",
              color: "white"
            }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
          </button>

          <button 
            className="btn btn-link p-1 text-dark"
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                console.log("Skipped forward 10 seconds");
              }
            }}
            title="Skip forward 10 seconds"
          >
            <IoPlaySkipForward size={20} />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadStart={() => console.log("Audio load started")}
        onCanPlay={() => console.log("Audio can play")}
        onPlay={() => console.log("Audio play event")}
        onPause={() => console.log("Audio pause event")}
        onError={(e) => console.error("Audio error:", e)}
        onEnded={() => {
          console.log("Audio ended");
          setIsPlaying(false);
        }}
        preload="metadata"
      />
    </div>
  );
};
