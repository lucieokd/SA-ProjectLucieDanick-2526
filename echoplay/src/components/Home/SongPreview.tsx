import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getToken, getFypTracks } from '../../API/SpotifyCred';
import { getPreviewUrlFromITunes } from '../../API/ITunesSearchServices';
import LoadingSpinner from '../Spotify/LoadingSpinner';
import Errormessage from '../Spotify/Errormessage';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import '../../styles/SongPreview.css';

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
}

const SongPreview = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tokenData = await getToken();
        console.log('Token obtained, fetching tracks...');
        
        const tracksData = await getFypTracks(
          tokenData.access_token, 
          ['The Weeknd'], // Artiesten
          ['pop'], // Genres
        );
        console.log('Tracks received:', tracksData?.length || 0);
        
        if (!tracksData || tracksData.length === 0) {
          setError('Geen tracks gevonden');
          return;
        }
        
        console.log('Ophalen preview URLs via iTunes...');
        const tracksWithPreview = await Promise.all(
          tracksData.map(async (track: any) => {            
            // Zoek preview_url via iTunes op basis van track naam en artist naam
            const artistName = track.artists?.[0]?.name || '';
            const previewUrl = await getPreviewUrlFromITunes(track.name, artistName);
            
            return {
              ...track,
              preview_url: previewUrl
            };
          })
        );
        
        console.log('Tracks met preview URLs:', tracksWithPreview.filter((t: any) => t.preview_url).length);
        setTracks(tracksWithPreview);
      } catch (err: any) {
        setError(err.message || 'Er is een fout opgetreden');
        console.error('Error fetching tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Audio reset en reload wanneer track verandert
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);

      if (tracks[currentTrackIndex]?.preview_url) {
        audioRef.current.load();
      }
    }
  }, [currentTrackIndex, tracks]);

  // Navigatie functies
  const goToNextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  }, [currentTrackIndex, tracks.length]);

  const goToPreviousTrack = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  }, [currentTrackIndex]);

  const togglePlayback = async () => {
    if (!audioRef.current || !currentTrack.preview_url) {
      console.log('Geen audio element of preview_url:', {
        hasAudioRef: !!audioRef.current,
        hasPreviewUrl: !!currentTrack.preview_url,
        previewUrl: currentTrack.preview_url
      });
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Zorg dat audio geladen is
        if (audioRef.current.readyState === 0) {
          audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Audio afspelen gestart:', currentTrack.preview_url);
      }
    } catch (error: any) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      // Toon error aan gebruiker
      alert('Kon audio niet afspelen. Mogelijk blokkeert je browser autoplay of de preview is niet beschikbaar.');
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (loading) {
    return <LoadingSpinner message="Aanbevelingen laden..." />;
  }

  if (error) {
    return <Errormessage error={error} />;
  }

  if (!tracks || tracks.length === 0) {
    return <Errormessage error={undefined} message="Geen aanbevelingen gevonden" />;
  }

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="position-relative w-100 fyp-container">
      <button
        className="btn nav-button nav-button-left"
        onClick={goToPreviousTrack}
        disabled={currentTrackIndex === 0}
        aria-label="Vorige song"
        type="button"
      >
        <IoChevronBack size={32} />
      </button>

      <button
        className="btn nav-button nav-button-right"
        onClick={goToNextTrack}
        disabled={currentTrackIndex === tracks.length - 1}
        aria-label="Volgende song"
        type="button"
      >
        <IoChevronForward size={32} />
      </button>

      <div className="track-item">
        {/* Audio element voor preview */}
        {currentTrack.preview_url && (
          <audio
            key={currentTrack.id}
            ref={audioRef}
            src={currentTrack.preview_url}
            onEnded={handleAudioEnded}
            onPlay={() => {
              console.log('Audio play event triggered');
              setIsPlaying(true);
            }}
            onPause={() => {
              console.log('Audio pause event triggered');
              setIsPlaying(false);
            }}
            onError={(e) => {
              console.error('Audio error:', e);
              setIsPlaying(false);
              alert('Fout bij het laden van de audio preview.');
            }}
            onCanPlay={() => {
              console.log('Audio can play:', currentTrack.preview_url);
            }}
            preload="auto"
            crossOrigin="anonymous"
          />
        )}

        {/* Cover afbeelding */}
        <div className="track-cover">
          {currentTrack.album.images.length > 0 ? (
            <img 
              src={currentTrack.album.images[0].url} 
              alt={`Cover van ${currentTrack.album.name}`}
              className="cover-image"
            />
          ) : (
            <div className="cover-placeholder">Geen cover</div>
          )}
        </div>

        {/* Song informatie */}
        <div className="track-info">
          <h2 className="track-title">{currentTrack.name}</h2>
          <p className="track-artist">
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </p>
          <p className="track-album">{currentTrack.album.name}</p>
        </div>

        {/* Play/Pause knop */}
        <div className="track-controls">
          {currentTrack.preview_url ? (
            <button 
              onClick={togglePlayback}
              className={`play-button ${isPlaying ? 'playing' : ''}`}
              type="button"
            >
              {isPlaying ? '⏸️ Pauze' : '▶️ Afspelen'}
            </button>
          ) : (
            <p className="no-preview">Geen preview beschikbaar</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default SongPreview;
