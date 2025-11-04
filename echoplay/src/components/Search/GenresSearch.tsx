import React, { useState } from "react";
import { getToken, getTrackInfo } from "../../API/SpotifyCred";
import { AiOutlineSearch } from "react-icons/ai";

const GenreSearch = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!query.trim()) return;
  
      try {
        setLoading(true);
        setError(null);
  
        const tokenData = await getToken();
  
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            query
          )}&type=track&limit=10`,
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

    const Genre = "Example Genre";
    return (
    <div>
        <form onSubmit={handleSubmit} className="d-flex flex-row gap-2 flex-wrap">
              <button type="submit"
              className="px-4 py-2 text-dark border-0"
              style={{ 
                backgroundColor: 'rgba(108, 43, 217, 0.2)',
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.2)'}>
                {Genre}
              </button>
              <button type="submit"
              className="px-4 py-2 text-dark border-0"
              style={{ 
                backgroundColor: 'rgba(108, 43, 217, 0.2)',
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.2)'}>
                {Genre}
              </button>
              <button type="submit"
              className="px-4 py-2 text-dark border-0"
              style={{ 
                backgroundColor: 'rgba(108, 43, 217, 0.2)',
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.2)'}>
                {Genre}
              </button>
              <button type="submit"
              className="px-4 py-2 text-dark border-0"
              style={{ 
                color: 'white',
                backgroundColor: 'rgba(108, 43, 217, 0.2)',
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.2)'}>
                {Genre}
              </button>
        </form>
    </div>

  );
} 
export default GenreSearch;