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

export async function getFypTracks(access_token: string, artists: string[] = [], genres: string[] = [], limit: number = 250) {
  // Maak meerdere aparte queries en combineer de resultaten (OR logica)
  const allQueries: string[] = [];
  
  artists.forEach(artist => {
    allQueries.push(`artist:${artist}`);
  });
  genres.forEach(genre => {
    allQueries.push(`genre:${genre}`);
  });
  
  if (allQueries.length === 0) {
    allQueries.push('genre:pop');
  }
  
  console.log('Spotify queries to fetch:', allQueries);
  console.log('Limit:', limit);
  
  const allTracks: any[] = [];
  const limitPerRequest = 50;
  const maxResultsPerQuery = Math.max(limit * 5, 100);
  
  try {
    // Voor elke query, maak een aparte API call
    for (const query of allQueries) {
      console.log(`Fetching tracks for query: ${query}`);
      const queryTracks: any[] = [];
      
      // Maak meerdere requests voor deze query (paginering)
      for (let offset = 0; offset < maxResultsPerQuery; offset += limitPerRequest) {
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limitPerRequest}&offset=${offset}`;
        console.log(`Fetching from Spotify (offset: ${offset}):`, url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + access_token },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Spotify API error (status ${response.status}):`, errorText);
          
          // Bij de eerste request van de eerste query, gooi de error
          if (offset === 0 && allQueries.indexOf(query) === 0) {
            throw new Error(`Spotify API error: ${response.status} - ${errorText}`);
          }
          // Bij latere requests, stop met deze query
          break;
        }

        const data = await response.json();
        
        // Check of data.tracks bestaat
        if (!data.tracks) {
          console.error('No tracks property in response:', data);
          if (offset === 0 && allQueries.indexOf(query) === 0) {
            throw new Error('Invalid response from Spotify API: no tracks property');
          }
          break;
        }
        
        const tracks = data.tracks.items;
        console.log(`Received ${tracks?.length || 0} tracks for query "${query}" (offset: ${offset})`);
        
        if (!tracks || tracks.length === 0) {
          // Geen meer tracks voor deze query, stop
          break;
        }
        
        queryTracks.push(...tracks);
        
        // Als we minder tracks krijgen dan gevraagd, zijn we bij het einde
        if (tracks.length < limitPerRequest) {
          break;
        }
      }
      
      console.log(`Total tracks fetched for query "${query}": ${queryTracks.length}`);
      allTracks.push(...queryTracks);
    }
    
    console.log(`Total tracks fetched from all queries: ${allTracks.length}`);
    
    // Verwijder duplicates op basis van track ID
    const uniqueTracks = Array.from(
      new Map(allTracks.map((track: any) => [track.id, track])).values()
    );
    
    console.log(`Unique tracks after deduplication: ${uniqueTracks.length}`);
    
    if (uniqueTracks.length === 0) {
      throw new Error('Geen tracks gevonden met de opgegeven zoekcriteria');
    }
    
    // Shuffle de tracks voor een FYP-achtige ervaring
    for (let i = uniqueTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueTracks[i], uniqueTracks[j]] = [uniqueTracks[j], uniqueTracks[i]];
    }
    
    // Neem alleen de eerste 'limit' tracks
    const limitedTracks = uniqueTracks.slice(0, limit);
    console.log(`Returning ${limitedTracks.length} tracks (gevraagde limit: ${limit})`);
    
    return limitedTracks;
  } catch (error: any) {
    console.error('Error in getFypTracks:', error);
    throw new Error(`Error fetching FYP tracks: ${error.message || error}`);
  }
}
