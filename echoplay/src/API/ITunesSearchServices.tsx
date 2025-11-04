export async function ITunesFetch(artist: string, limit: number = 20, country: string = 'US') {
    const response = 
    await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&limit=${limit}&country=${country}`);

    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }   
    return await response.json();
}

export async function getPreviewUrlFromITunes(trackName: string, artistName: string): Promise<string | null> {
  try {
    // Zoek in iTunes op basis van track naam en artist naam
    const searchTerm = `${trackName} ${artistName}`;
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=5`
    );

    if (!response.ok) {
      console.error('iTunes API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Zoek de beste match (vergelijk track naam en artist naam)
      const bestMatch = data.results.find((result: any) => {
        const resultTrackName = result.trackName?.toLowerCase() || '';
        const resultArtistName = result.artistName?.toLowerCase() || '';
        const searchTrackName = trackName.toLowerCase();
        const searchArtistName = artistName.toLowerCase();
        
        return (
          resultTrackName.includes(searchTrackName) || 
          searchTrackName.includes(resultTrackName)
        ) && (
          resultArtistName.includes(searchArtistName) ||
          searchArtistName.includes(resultArtistName)
        );
      }) || data.results[0]; // Neem eerste resultaat als fallback
      
      // iTunes geeft previewUrl in de response
      if (bestMatch.previewUrl) {
        console.log(`Preview URL gevonden voor "${trackName}" van "${artistName}"`);
        return bestMatch.previewUrl;
      }
    }
    
    console.log(`Geen preview URL gevonden voor "${trackName}" van "${artistName}"`);
    return null;
  } catch (error) {
    console.error('Error fetching preview URL from iTunes:', error);
    return null;
  }
}

