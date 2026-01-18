export async function ITunesFetch(artist: string, limit: number = 20, country: string = 'US') {
    const response = 
    await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&limit=${limit}&country=${country}`);

    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }   
    return await response.json();
}

export async function ITunesFetchArtist(artist: string, limit: number = 1) {
    const response = 
    await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }   
    return await response.json();
}

export async function getTracksFromITunes(artists: string[] = [], limit: number = 150) {
  // Als er geen artiesten zijn, gebruik default artiesten
  if (artists.length === 0) {
    const defaultArtists = [
      'Taylor Swift',
      'Drake',
      'Rihanna',
      'Beyonce',
      'The Weeknd'
    ];
    artists = defaultArtists;
  }
  
  const allTracks: any[] = [];
  const tracksPerQuery = 50;
  
  // Helper functie om iTunes API aan te roepen via CORS proxy
  const fetchFromITunes = async (searchTerm: string): Promise<any | null> => {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=${tracksPerQuery}`;
    
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(itunesUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(itunesUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(itunesUrl)}`
    ];
    
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) continue;
        
        const text = await response.text();
        if (!text || !text.trim()) continue;
        
        try {
          const data = JSON.parse(text);
          if (data && typeof data === 'object' && data.results) {
            return data;
          }
        } catch {
          continue;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  };
  
  // Helper functie om iTunes resultaten te converteren naar Spotify-achtig format
  const convertToTrackFormat = (result: any) => ({
    id: result.trackId?.toString() || Math.random().toString(),
    name: result.trackName || 'Unknown',
    preview_url: result.previewUrl || null,
    album: {
      name: result.collectionName || 'Unknown Album',
      images: result.artworkUrl100 ? [{ url: result.artworkUrl100.replace('100x100', '640x640') }] : []
    },
    artists: [{ name: result.artistName || 'Unknown Artist' }]
  });
  
  // Helper functie om tracks te filteren en converteren
  const processTracks = (results: any[], artistFilter: string) => {
    const filtered = results.filter((result: any) => {
      const hasPreview = result.previewUrl && result.previewUrl !== null && result.previewUrl !== '';
      const matchesArtist = result.artistName?.toLowerCase().includes(artistFilter.toLowerCase());
      return hasPreview && matchesArtist;
    });
    
    return filtered.map(convertToTrackFormat);
  };
  
  try {
    // Zoek per artiest
    for (const artist of artists) {
      if (allTracks.length >= limit) break;
      
      try {
        const data = await fetchFromITunes(artist);
        if (!data?.results?.length) continue;
        
        const convertedTracks = processTracks(data.results, artist);
        allTracks.push(...convertedTracks);
      } catch (err) {
        console.error(`Error fetching tracks for artist "${artist}":`, err);
      }
    }
    
    // Verwijder duplicates op basis van track ID
    const uniqueTracks = Array.from(
      new Map(allTracks.map((track: any) => [track.id, track])).values()
    );
    
    // Shuffle voor FYP-achtige ervaring
    for (let i = uniqueTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueTracks[i], uniqueTracks[j]] = [uniqueTracks[j], uniqueTracks[i]];
    }
    
    return uniqueTracks.slice(0, limit);
  } catch (error: any) {
    console.error('Error in getTracksFromITunes:', error);
    throw new Error(`Error fetching tracks from iTunes: ${error.message || error}`);
  }
}

// search
export async function getPreviewUrlFromITunes(trackName: string, artistName: string): Promise<string | null> {
  try {
    const searchTerm = `${trackName} ${artistName}`;
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=5`;
    
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(itunesUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(itunesUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(itunesUrl)}`
    ];
    
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) continue;
        
        const text = await response.text();
        if (!text || !text.trim()) continue;
        
        const data = JSON.parse(text);
        
        if (!data?.results?.length) continue;
        
        const searchTrackName = trackName.toLowerCase();
        const searchArtistName = artistName.toLowerCase();
        
        const bestMatch = data.results.find((result: any) => {
          const resultTrackName = result.trackName?.toLowerCase() || '';
          const resultArtistName = result.artistName?.toLowerCase() || '';
          
          return (
            (resultTrackName.includes(searchTrackName) || searchTrackName.includes(resultTrackName)) &&
            (resultArtistName.includes(searchArtistName) || searchArtistName.includes(resultArtistName))
          );
        }) || data.results[0];
        
        if (bestMatch?.previewUrl) {
          return bestMatch.previewUrl;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching preview URL from iTunes:', error);
    return null;
  }
}

export async function fetchMetadataByArtist(artist: string) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    artist
  )}&media=music&entity=song&limit=25`;

  const response = await fetch(url);
  const data = await response.json();
  const artistLower = artist.toLowerCase();

  return data.results
    .filter((r: any) =>
    r.artistName && r.artistName.toLowerCase().includes(artistLower)
  )
    .map((r: any) => ({
    id: r.trackId?.toString(),
    name: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    artwork: r.artworkUrl100?.replace("100x100", "640x640") || null,
    preview_url: undefined, // 👈 belangrijk
  }));
};


export async function fetchAlbumForArtist(artist: string) {
  const album = `https://itunes.apple.com/search?term=${encodeURIComponent(
    `${artist}`
  )}&media=music&entity=album&limit=20`;

  if (!album) return [];

  const data = await fetch(album);
  const albumsJson = await data.json();

  if (albumsJson.resultCount === 0) return [];
  
  const artistLower = artist.toLowerCase();
  const albums = albumsJson.results.filter(
    (r: any) => r.collectionType === "Album" && 
                r.trackCount > 1 &&
                r.artistName?.toLowerCase().includes(artistLower)
  );

  if (albums.length === 0) return [];

  return albums.map((album: any) => ({
    name: album.collectionName,
    image: album.artworkUrl100,
    trackCount: album.trackCount,
    artistName: album.artistName
  }));
}

export async function fetchPreviewUrl(trackId: string) {
  const url = `https://itunes.apple.com/lookup?id=${trackId}`;
  const res = await fetch(url);
  const data = await res.json();

  return data.results[0]?.previewUrl || null;
}

export async function fetchTracksFromPlaylist(playlistName: string, artistName: string) {
  try {
    const searchTerm = `${playlistName} ${artistName}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=200`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }
    
    const data = await response.json();
    
    if (!data?.results || data.results.length === 0) {
      return [];
    }
    
    // Filter tracks die bij het album horen (exacte match op collectionName en artistName)
    const playlistNameLower = playlistName.toLowerCase();
    const artistNameLower = artistName.toLowerCase();
    
    const tracks = data.results
      .filter((result: any) => {
        const resultCollectionName = result.collectionName?.toLowerCase() || '';
        const resultArtistName = result.artistName?.toLowerCase() || '';
        
        return (
          resultCollectionName.includes(playlistNameLower) || 
          playlistNameLower.includes(resultCollectionName)
        ) && (
          resultArtistName.includes(artistNameLower) || 
          artistNameLower.includes(resultArtistName)
        );
      })
      .map((result: any) => ({
        name: result.trackName || 'Unknown Track'
      }));
    
    // Verwijder duplicates op basis van track naam
    const uniqueTracks = Array.from(
      new Map(tracks.map((track: any) => [track.name, track])).values()
    );
    
    return uniqueTracks;
  } catch (error) {
    console.error('Error fetching tracks from playlist:', error);
    return [];
  }
}
