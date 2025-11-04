

const TogglePlayback = () => {
    if (!song?.preview_url) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('Error playing audio:', err);
            setError('Kan de preview niet afspelen');
          });
      }
    }
};

export default TogglePlayback;