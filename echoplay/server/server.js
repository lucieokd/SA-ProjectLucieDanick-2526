// echoplay/server/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// iTunes search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { trackName, artistName } = req.body;
    
    if (!trackName || !artistName) {
      return res.status(400).json({ error: 'Track and artist name required' });
    }

    const searchTerm = `${trackName} ${artistName}`;
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=5`;
    
    console.log('🔍 Searching iTunes for:', searchTerm);
    
    const response = await fetch(itunesUrl);
    
    if (!response.ok) {
      console.error('iTunes API error:', response.status);
      return res.status(response.status).json({ 
        error: 'iTunes API error',
        status: response.status 
      });
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Zoek beste match
      const bestMatch = data.results.find((result) => {
        const resultTrack = (result.trackName || '').toLowerCase();
        const resultArtist = (result.artistName || '').toLowerCase();
        const searchTrack = trackName.toLowerCase();
        const searchArtist = artistName.toLowerCase();
        
        return (
          resultTrack.includes(searchTrack) || 
          searchTrack.includes(resultTrack)
        );
      }) || data.results[0];
      
      if (bestMatch.previewUrl) {
        console.log('✅ Preview found:', bestMatch.trackName);
        return res.json({ 
          success: true,
          previewUrl: bestMatch.previewUrl,
          trackName: bestMatch.trackName,
          artistName: bestMatch.artistName
        });
      }
    }
    
    console.log('❌ No preview found for:', searchTerm);
    res.json({ 
      success: false, 
      previewUrl: null
    });
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Echoplay iTunes Proxy is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Echoplay iTunes Proxy running on http://localhost:${PORT}`);
});