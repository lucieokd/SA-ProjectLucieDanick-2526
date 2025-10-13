import SongTile from "../components/Home/SongTile";
import GenreTile from "../components/Home/GenreTile";
import ArtistBuble from "../components/Home/ArtistBuble";

function HomePage() {
    const demoSong = {
      cover: "https://via.placeholder.com/150",
      title: "Shape of You",
      artist: "Ed Sheeran",
    };
    const demoGenre = {
      logo: "https://via.placeholder.com/160",
      title: "Jazz",
    };
    const demoArtist = {
      image: "https://via.placeholder.com/170",
      name: "Broken Dreams",
    };
  return (
    <div className="home-page">
      <h1>Home</h1>
        <h2>Recent songs</h2>
      <SongTile song={demoSong}>
      </SongTile>
        <h2>Explore Genres</h2>
      <GenreTile genre={demoGenre}>
      </GenreTile>
        <h2>Favorite Artists</h2>
      <ArtistBuble artist={demoArtist}>
      </ArtistBuble>
    </div>
  );
}

export default HomePage;