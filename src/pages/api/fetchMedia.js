// pages/api/fetchMedia.js
import axios from 'axios';
export default async function handler(req, res) {
  const { mediaId } = req.query;

  if (!mediaId) {
    return res.status(400).json({ error: 'Media ID is required' });
  }

  try {
    
    const response = await axios.get(`https://graph.facebook.com/v20.0/${mediaId}`, {
      headers: {
        Authorization: `Bearer EAAL9suZAbOKABOyOUfr4kXmcTFqJmpbb6dhAZAO98CjWRpuc3qjjqZC3LcYZBpe6nherb1SipPgAdp9e3pn7OzxeUe799iFtHE3xh9c4LZANqXvnyUcJMGcmmNj5hUMdhiCqCGbxx0XtZAaYgKVpLi7jGDCgI6I0Rw6aJeztZBiwnfGRIuhYdTAzrQrTgkga7OXGhikabYZCZBzZBHn84W6TlawnBXDAtZCfpcgfVEeWTl58x864yN34FUZD`,
      },
    });

    const mediaUrl = response.data.url;

    // Fetch media data from the media URL
    const mediaResponse = await axios.get(mediaUrl, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      responseType: 'arraybuffer',
    });

    const base64Data = Buffer.from(mediaResponse.data, 'binary').toString('base64');
    res.status(200).json({ base64Data });
    
  } catch (error) {
    console.error('Error fetching media data:', error.message);
    res.status(500).json({ error: 'Failed to fetch media data.' });
  }
}
