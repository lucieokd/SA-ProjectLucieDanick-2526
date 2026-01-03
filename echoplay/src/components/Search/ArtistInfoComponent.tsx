import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getToken, getArtistInfo } from "../../API/SpotifyCred";
import { useFavouriteArtists } from "../../contexts/FavouriteArtistsContext";
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


const ArtistInfoComponent = () => {
  const [searchParams] = useSearchParams();
  const artistName = searchParams.get("artist");
  const [artist, setArtist] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favArtists, addArtist, removeArtist, isFollowing } = useFavouriteArtists();
  const navigate = useNavigate();

   const handleAddArtist = (artist: Artist) => {
          const isAlreadyAdded = isFollowing(artist.id);
          
          if (!isAlreadyAdded) {
              addArtist(artist);
              console.log("Artiest toegevoegd aan favorieten:", artist.name);
          } else {
              // Verwijder de artiest als deze al toegevoegd is (unfollow)
              removeArtist(artist.id);
              console.log("Artiest verwijderd uit favorieten:", artist.name);
          }
    };

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistName) return;

      try {
        setLoading(true);
        setError(null);

        const tokenData = await getToken();
        const artistData = await getArtistInfo(tokenData.access_token, artistName);

        if (artistData.artists && artistData.artists.items.length > 0) {
          const artistInfo = artistData.artists.items[0];
          setArtist(artistInfo);

          // Haal albums op voor deze artiest
          const albumsResponse = await fetch(
            `https://api.spotify.com/v1/artists/${artistInfo.id}/albums?include_groups=album&limit=50`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + tokenData.access_token,
                "Content-Type": "application/json",
              },
            }
          );

          if (albumsResponse.ok) {
            const albumsData = await albumsResponse.json();
            setAlbums(albumsData.items || []);
          }
        } else {
          setError("Artiest niet gevonden");
        }
      } catch (err: any) {
        setError(err.message || "Er is een fout opgetreden");
        console.error("Error fetching artist data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistName]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mt-4">
        <p>Geen artiest geselecteerd</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row align-items-start">
        <div className="col-md-4 col-sm-12 mb-4 mb-md-0">
                <button             
        className="btn btn-outline-secondary"
        onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Terug
      </button>
          <div className="text-center">
            {artist.images && artist.images.length > 0 && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="img-fluid rounded shadow"
                style={{ maxWidth: "100%", width: "300px" }}
              />
            )}
          </div>
        </div>
        <div className="col-md-8 col-sm-12">
          <div className="d-flex flex-column">
            <h1 className="mb-3">{artist.name}</h1>
            <p className="mb-3">
              <strong>Volgers:</strong> {artist.followers?.total?.toLocaleString() || 0}
            </p>
            <div className="mb-3">
              {(() => {
                const isAdded = isFollowing(artist.id);
                return (
                  <button 
                    type="button" 
                    onClick={() => handleAddArtist(artist)}
                    className="btn btn-primary"
                    style={{ marginTop: '10px' }}
                  >
                    {isAdded ? 'Unfollow' : 'Follow'}
                  </button>
                );
              })()}
            </div>
        </div>
    </div>
    </div>
    </div>

  );
}

export default ArtistInfoComponent;