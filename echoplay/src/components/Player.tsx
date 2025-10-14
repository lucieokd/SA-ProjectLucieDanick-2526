import React, { useRef, useState } from "react";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHigh,
} from "react-icons/io5";
import "../styles/Player.css";

interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

const sampleTrack: Track = {
  title: "Pookie",
  artist: "Aya Nakamura",
  cover: "/src/assets/cover.jpg",
  src: "/assets/sample.mp3",
};

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  return (
    <div className="player">
      <img
        src={sampleTrack.cover}
        alt={sampleTrack.title}
        className="player-cover"
      />

      <div className="player-info">
        <h3>{sampleTrack.title}</h3>
        <p>{sampleTrack.artist}</p>
      </div>

      <div className="player-controls">
        <button>
          <IoPlaySkipBack size={24} color="#333" />
        </button>

        <button onClick={togglePlay} className="play-btn">
          {isPlaying ? <IoPause size={36} /> : <IoPlay size={36} />}
        </button>

        <button>
          <IoPlaySkipForward size={24} color="#333" />
        </button>
      </div>

      <input
        type="range"
        className="progress"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
      />

      <audio
        ref={audioRef}
        src={sampleTrack.src}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};
