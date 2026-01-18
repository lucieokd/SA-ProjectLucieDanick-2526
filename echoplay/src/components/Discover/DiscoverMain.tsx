import { useFavouriteArtists } from "../../contexts/FavouriteArtistsContext";
import { fetchAlbumForArtist } from "../../API/ITunesSearchServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  trackCount: number;
  artistName?: string;
}

const DiscoverMain = () => {
    const { favArtists  } = useFavouriteArtists();
    const [DiscoverAlbums, setDiscoverAlbums] = useState<Album[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadAlbums() {
            const results: Album[] = [];
            for (const artist of favArtists) {
                const albums = await fetchAlbumForArtist(artist.name);
                if (albums && albums.length > 0) {
                    albums.forEach((album) => {
                        results.push({
                            id: `${artist.name}-${album.name}-${Date.now()}-${Math.random()}`,
                            name: album.name,
                            trackCount: album.trackCount,
                            artistName: album.artistName,
                            images: album.image ? [{ url: album.image.replace('100x100', '640x640') }] : []
                        });
                    });
                }
            }
            setDiscoverAlbums(results);
        }
        loadAlbums();
    }, [favArtists]);

    const onAlbumClick = (album: Album) => {
        navigate(`/discover/album?name=${encodeURIComponent(album.name)}&artist=${encodeURIComponent(album.artistName || '')}`);
    }


 return (
    <div className="container-fluid">
        <div className="text-center pb-3">
            <h2 className="Title mb-0 mt-4">
                Dicover de albums van je favoriete artiesten hier
            </h2>
        </div>
        <div className="row g-4">
            {DiscoverAlbums.map((album, index) => (
                <div key={album.id || index} className="col-6 col-md-4 col-lg-3 col-xl-2">
                    <div 
                        className="card shadow-sm h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => onAlbumClick(album)}
                        role="button"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onAlbumClick(album);
                            }
                        }}
                    >
                        {album.images.length > 0 && (
                            <img 
                                src={album.images[0]?.url} 
                                alt={album.name}
                                className="card-img-top"
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                        <div className="card-body">
                            <h5 className="card-title mb-2 text-truncate" title={album.name}>
                                {album.name}
                            </h5>
                            <p className="card-text text mb-0">
                                {album.artistName}
                            </p>
                            <p className="card-text text-muted small mb-0">
                                {album.trackCount} {album.trackCount === 1 ? 'nummer' : 'nummers'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>

  );
}

export default DiscoverMain;