function SongTile({song}) {
  return (
    <div className="song-tile">
        <img src={song.cover} alt={song.title} />
        <p style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'bold'
        }}>{song.title}</p>
        <p style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'gray'
        }}>{song.artist}</p>
    </div>
  );
}
export default SongTile;