import React, { useState } from "react";
import { getToken } from "../../API/SpotifyCred";

const GenreSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenreClick = async (genre: string) => {
    try {
      setLoading(true);
      setQuery(genre);

      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(
          genre
        )}&type=track&limit=20`,
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

      // De resultaten kunnen worden doorgegeven aan de parent component indien nodig
      const data = await response.json();
      console.log(`Genre ${genre} resultaten:`, data.tracks.items);
    } catch (err) {
      console.error("Genre search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    "Pop",
    "Rock",
    "Hip-Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "Country",
    "R&B",
    "Reggae",
    "Blues",
    "Metal",
    "Folk",
    "Latin",
    "Indie",
    "Punk"
  ];

  return (
    <div className="mb-4">
      <h2 className="h4 mb-3 fw-bold">Ontdek per Genre</h2>
      <div className="d-flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <button
            key={index}
            type="button"
            className="btn btn-outline-primary rounded-pill"
            onClick={() => handleGenreClick(genre)}
            disabled={loading}
            style={{
              backgroundColor: query === genre ? 'rgba(108, 43, 217, 0.2)' : 'transparent',
              borderColor: 'rgba(108, 43, 217, 0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (query !== genre) {
                e.currentTarget.style.backgroundColor = 'rgba(108, 43, 217, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(108, 43, 217, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (query !== genre) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(108, 43, 217, 0.5)';
              }
            }}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreSearch;
