'use strict';

import express, { Request, Response } from 'express';
import * as genres from './routes/genres';
import * as ratings from './routes/ratings';
import * as movies from './routes/movies';
import { Database, OPEN_READONLY } from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 3000;

const ratingsDB = new Database('./movies_api/db/ratings.db', OPEN_READONLY, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Ratings database opened successfully');
  }
});

const moviesDB = new Database('./movies_api/db/movies.db', OPEN_READONLY, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Movies database opened successfully');
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the movie API!');
});

app.get('/genres/all', (req: Request, res: Response) => { 
  genres.getGenreList(moviesDB, req, res);
});

app.get('/heartbeat', (req: Request, res: Response) => { 
  res.send('Have fun with the project!');
});

app.get('/ratings/:movieId', (req: Request, res: Response) => {
  ratings.getRating(ratingsDB, req, res);
});

app.get('/movies/all', (req: Request, res: Response) => {
  movies.getAllMovies(moviesDB, req, res);
});

app.get('/movies/year/:year', (req: Request, res: Response) => {
  movies.getMoviesByYear(moviesDB, req, res);
});

app.get('/movies/:movieId', (req: Request, res: Response) => {
  movies.getMovie(moviesDB, req, res);
});


app.get('/movies/genre/:genre', (req: Request, res: Response) => {
  movies.getMoviesByGenre(moviesDB, req, res);
});
// Catch-all 404 handler for unknown routes
app.use((req: Request, res: Response, next: Function) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.'
  });
});

// Centralized error handler (must be after all routes)
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: err.details || undefined
  });
});


export default app;