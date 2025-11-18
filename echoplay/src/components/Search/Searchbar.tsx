import React, { useState } from "react";
import { getToken, getTrackInfo, getArtistInfo } from "../../API/SpotifyCred";
import { ITunesFetchArtist } from "../../API/ITunesSearchServices";
import { AiOutlineSearch } from "react-icons/ai";
import ErrorMessage from "../ErrorMessage";
import { useNavigate } from "react-router-dom";


interface Artist {
  id: string;
  name: string;
  genres: Array<string>;
  images: Array<{ url: string }>;
  followers: {
    total: number;
  };
  popularity: number;
}

const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleArtistSearch = async (artistName: string) => {
    try {
      setLoading(true);
      setError(null);

      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          artistName
        )}&type=artist`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tokenData.access_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Voor test: log de naam van de artiest in de console
      console.log("Geselecteerde artiest:", artistName);
      const data = await response.json();
      const artistNameFromSpotify = data.artists.items[0]?.name || artistName;
      
      navigate(`/Artistinfo?artist=${encodeURIComponent(artistNameFromSpotify)}`);
    } catch (error) {
      console.error("Fout bij het ophalen van artiestgegevens:", error);
      setError('Er is een fout opgetreden bij het zoeken naar artiesten');
      setSearchTerm('');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tokenData.access_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTracks(data.tracks.items);
    } catch (err) {
      setError(err.message || "Er is een fout opgetreden bij het zoeken");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSearch} className="flex items-center mb-4" style={{ gap: '12px' }}>
        <div className="relative w-full" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Zoek liedjes, artiesten..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : <AiOutlineSearch size={20} />}
          </button>
        </div>
      </form>

      {error && (
        <ErrorMessage text={error} />
      )}

      <div className="space-y-4">
        {tracks.length > 0
          ? tracks.map((track) => (
              <div
                key={track.id}
                className="p-4 border rounded-lg shadow-sm text-left bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  {track.album.images.length > 0 && (
                    <img
                      src={
                        track.album.images[2]?.url || track.album.images[0]?.url
                      }
                      alt={`Cover van ${track.album.name}`}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {track.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {track.artists.map((artist, index) => (
                        <span key={artist.id}>
                          <span
                            onClick={() => handleArtistSearch(artist.name)}
                            className="cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                          >
                            {artist.name}
                          </span>
                          {index < track.artists.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {track.album.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <p className="text-gray-500 py-8">
                {query
                  ? "Geen resultaten gevonden — probeer iets anders"
                  : "Zoek naar songs om resultaten te zien..."}
              </p>
            )}
        {loading && (
          <div className="text-gray-500 py-8">Zoeken naar "{query}"...</div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
