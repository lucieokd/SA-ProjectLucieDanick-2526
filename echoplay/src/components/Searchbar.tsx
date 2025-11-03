

import React, { useState } from "react";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);

  const CLIENT_ID = "ae5fd2ca";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&artist_name=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setTracks(data.results || []);
    } catch (err) {
      console.error("Error fetching tracks:", err);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto text-center">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for a track..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </form>

      {/* Track results */}
      <div className="space-y-4">
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <div
              key={track.id}
              className="p-3 border rounded-lg shadow-sm text-left"
            >
              <h3 className="font-semibold">{track.name}</h3>
              <p className="text-sm text-gray-600">{track.artist_name}</p>
              <audio controls className="w-full mt-2">
                <source src={track.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results yet — try searching 🎶</p>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
