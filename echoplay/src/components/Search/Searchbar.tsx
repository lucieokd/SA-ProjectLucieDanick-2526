import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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
      
    </div>
  );
};

export default Searchbar;
