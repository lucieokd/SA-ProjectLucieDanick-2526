

function ArtistBuble({ artist }) {
  return (
    <div className="artist-bubble">
      <img src={artist.image} alt={artist.name} className="artist-image" />
      <p className="artist-name">{artist.name}</p>
    </div>
  );
}

export default ArtistBuble;