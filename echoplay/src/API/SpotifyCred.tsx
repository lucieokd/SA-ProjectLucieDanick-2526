const client_id = '8b911a044b264c95b62e00b6a0569f5a';
const client_secret = 'f4f2c658f3324304aac2368b2e2ef687';

export async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}


export async function getTrendingTracks(access_token: string) {
  // Gebruik de Spotify "Playlist" API om populaire songs op te halen
  // We gebruiken een populaire playlist zoals "Today's Top Hits"
  const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks?limit=10', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => item.track);
}

export async function getTrackInfo(access_token: string, trackId: string = "4cOdK2wGLETKBW3PvgPWqT") {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function getArtistInfo(access_token: string, artistName: string) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}


/**
 * Haalt de Top 50 Global playlist op van Spotify
 * Playlist ID: 37i9dQZEVXbMDoHDwVN2tF (Top 50 Global)
 */
export async function getTop50GlobalTracks(access_token: string) {
  const TOP_50_GLOBAL_ID = '37i9dQZF1DXcBWIGoYBM5M';
  const MY_PLAYLIST_ID = '54xdmqNhh3rcFDgOAcMOQ9'; // <-- Hier je ID invullen

  
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${MY_PLAYLIST_ID}/tracks?limit=50`,
    {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => item.track);
}

/**
 * Extraheert unieke artiesten uit een lijst van tracks
 * Returnt een array van artiesten met hun ID, naam en afbeelding
 */
export async function getUniqueArtistsFromTracks(tracks: any[]) {
  const artistMap = new Map();

  tracks.forEach((track: any) => {
    if (!track || !track.artists) return;

    track.artists.forEach((artist: any) => {
      if (!artistMap.has(artist.id)) {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
        });
      }
    });
  });

  return Array.from(artistMap.values());
}

/**
 * Haalt volledige artiest informatie op (inclusief afbeeldingen)
 * voor een lijst van artiest IDs
 */
export async function getArtistsDetails(access_token: string, artistIds: string[]) {
  // Spotify API accepteert max 50 IDs per request
  const chunks = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    chunks.push(artistIds.slice(i, i + 50));
  }

  const allArtists = [];

  for (const chunk of chunks) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${chunk.join(',')}`,
      {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    allArtists.push(...data.artists);
  }

  return allArtists;
}

/**
 * Hoofdfunctie: Haalt trending artiesten op basis van Top 50 Global
 * Returnt een array van artiesten met alle details (naam, ID, afbeelding)
 */
export async function getTrendingArtists(limit: number = 20) {
  try {
    // 1. Haal access token op
    const tokenData = await getToken();
    
    // 2. Haal Top 50 tracks op
    const tracks = await getTop50GlobalTracks(tokenData.access_token);
    
    // 3. Extraheer unieke artiesten
    const uniqueArtists = await getUniqueArtistsFromTracks(tracks);
    
    // 4. Haal volledige details op (inclusief afbeeldingen)
    const artistIds = uniqueArtists.map((a: any) => a.id);
    const artistsWithDetails = await getArtistsDetails(tokenData.access_token, artistIds);
    
    // 5. Sorteer op populariteit en limiteer
    const sortedArtists = artistsWithDetails
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
    
    return sortedArtists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      images: artist.images,
      genres: artist.genres,
      followers: artist.followers,
      popularity: artist.popularity,
    }));
  } catch (error) {
    console.error('Error fetching trending artists:', error);
    // Fallback naar hardcoded lijst bij fout
    return [
      { name: "Drake", id: "3TVXtAsR1Inumwj472S9r4" },
      { name: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02" },
      { name: "Rihanna", id: "5pKCCKE2ajJHZ9KAiaK11H" },
      { name: "Bad Bunny", id: "4q3ewBCX7sLwd24euuV69X" },
      { name: "Ninho", id: "6v49oH3RJl7hBGtO6MhK6U" },
    ];
  }
}
