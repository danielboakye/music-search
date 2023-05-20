import express, { Request, Response } from 'express';
import axios from 'axios';
import type { IProcessedTracks, IProcessedArtist, IAlbum } from './types'
import cors from 'cors'
import functions from 'firebase-functions'

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

const API_BASE_URL = 'https://api.deezer.com'
const GET_ARTIST = 'artist'
const CORS_PREFIX = 'https://cors-anywhere.herokuapp.com'
const headers = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}

const formatDuration = (duration: any): string => {
  var sd = `${duration}`
  return '0' + sd.substring(0, 1) + ':' + sd.substring(1, 3);
}

app.get('/search', async (req: Request, res: Response) => {
  const { query } = req.query;

  try {

    const response = await axios.get(`${CORS_PREFIX}/${API_BASE_URL}/search?q=${query}`, headers);
    const tracks = response.data.data;
    if(!tracks){
      res.status(500).json({ error: `Error fetching results for ${query}` });
    }

    const processedTracks: IProcessedTracks = tracks.map((track: any) => ({
      id: track.artist.id,
      artist: track.artist.name,
      picture: track.album.cover_medium,
      duration: track.duration ? formatDuration(track.duration) : '',
      album: track.album ? track.album.title : ''
    }));

    res.json(processedTracks);
  } catch (error) {
    console.error(`Error fetching results for ${query}: `, error);
    res.status(500).json({ error: `Error fetching results for ${query}` });
  }
});

app.get('/artist/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${CORS_PREFIX}/${API_BASE_URL}/${GET_ARTIST}/${id}`, headers);
    const artist = response.data;
    if(!artist){
      res.status(500).json({ error: `Error fetching results` });
    }

    const topTracksResponse = await axios.get(`${CORS_PREFIX}/${API_BASE_URL}/${GET_ARTIST}/${id}/top`, headers);
    const topTracks = topTracksResponse.data.data;
    if(!topTracks){
      res.status(500).json({ error: `Error fetching results` });
    }

    const processedArtist: IProcessedArtist = {
      name: artist.name,
      picture: artist.picture_big,
      fans: artist.nb_fan,
      topTracks: topTracks ? topTracks.slice(0, 5).map((track: any) => ({
        title: track.title, 
        duration: formatDuration(track.duration)
      })) : [],
    };

    const albumsResponse = await axios.get(`${CORS_PREFIX}/${API_BASE_URL}/${GET_ARTIST}/${id}/albums`, headers);
    const albums = albumsResponse.data.data;
    if(!albums){
      res.status(500).json({ error: `Error fetching results` });
    }
  
    const processedAlbums: IAlbum[] = albums.map((album: any) => ({
      picture: album.cover_medium,
      name: album.title,
      releaseYear: album.release_date ? album.release_date.split('-')[0] : ""
    }));

    processedArtist.albums = processedAlbums;
    
    res.json(processedArtist);
  } catch (error) {
    console.error(`Error fetching details for artist: ${id}: `, error);
    res.status(500).json({ error: `Error fetching details for artist: ${id}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

exports.app = functions.https.onRequest(app);