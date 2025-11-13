import React, { useState } from "react";
import { getToken, getTrackInfo } from "../../API/SpotifyCred";
import { AiOutlineSearch } from "react-icons/ai";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="p-4 max-w-lg mx-auto text-center">
      <form onSubmit={handleSearch} className="flex items-center mb-4" style={{ gap: '12px' }}>
        <div className="relative w-full" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Zoek liedjes, artiesten..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ 
              borderColor: '#6c2bd9',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '15px',
              marginRight: '5px',
            }}
          />
          <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center justify-center"
          style={{ 
            backgroundColor: '#6c2bd9', 
            color: 'white',
            border: '2px solid #6c2bd9',
            borderRadius: '35px',
          }}
        >
          {loading ? "..." : <AiOutlineSearch size={20} />}
        </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Track results */}
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
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {track.album.name}
                    </p>
                  </div>
                </div>

                {track.preview_url && (
                  <audio controls className="w-full mt-2">
                    <source src={track.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {!track.preview_url && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Geen preview beschikbaar
                  </p>
                )}
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
