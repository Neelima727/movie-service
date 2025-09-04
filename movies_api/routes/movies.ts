export const getMoviesByGenre = (db: Database, req: Request, res: Response): void => {
  const genre = req.params.genre;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  const query = `SELECT movieId, imdbId, title, genres, releaseDate, budget FROM movies WHERE genres LIKE ? LIMIT ? OFFSET ?`;
  const genrePattern = `%"name": "${genre}"%`;

  db.all(query, [genrePattern, limit, offset], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return;
    }
    if (rows.length === 0) {
      res.status(404).send('No movies found for this genre');
      return;
    }
    const movies = rows.map(row => ({
      movieId: row.movieId,
      imdbId: row.imdbId,
      title: row.title,
      genres: row.genres,
      releaseDate: row.releaseDate,
      budget: row.budget ? `$${Number(row.budget).toLocaleString()}` : null
    }));
    res.send({ genre, page, movies });
  });
};
export const getMoviesByYear = (db: Database, req: Request, res: Response): void => {
  const year = req.params.year;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  const sort = req.query.sort === 'desc' ? 'DESC' : 'ASC';
  const query = `SELECT movieId, imdbId, title, genres, releaseDate, budget FROM movies WHERE substr(releaseDate, 1, 4) = ? ORDER BY releaseDate ${sort} LIMIT ? OFFSET ?`;

  db.all(query, [year, limit, offset], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return;
    }
    if (rows.length === 0) {
      res.status(404).send('No movies found for this year');
      return;
    }
    const movies = rows.map(row => ({
      movieId: row.movieId,
      imdbId: row.imdbId,
      title: row.title,
      genres: row.genres,
      releaseDate: row.releaseDate,
      budget: row.budget ? `$${Number(row.budget).toLocaleString()}` : null
    }));
    res.send({ year, page, sort, movies });
  });
};
'use strict';

import { Database } from 'sqlite3';
import { Request, Response } from 'express';

export const getAllMovies = (db: Database, req: Request, res: Response): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  const query = `SELECT movieId, imdbId, title, genres, releaseDate, budget FROM movies LIMIT ? OFFSET ?`;

  db.all(query, [limit, offset], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return; 
    }

    console.log(rows);
    if (rows.length === 0) {
      res.status(404).send('No movies found'); 
      return; 
    }

    
    const movies = rows.map(row => ({
      movieId: row.movieId,
      imdbId: row.imdbId,
      title: row.title,
      genres: row.genres,
      releaseDate: row.releaseDate,
      budget: row.budget ? `$${Number(row.budget).toLocaleString()}` : null
    }));
    res.send({ page, movies });
  });
};

export const getMovie = (db: Database, req: Request, res: Response): void => {

  const query = `SELECT movieId, imdbId, title, overview, releaseDate, budget, runtime, genres, language, productionCompanies FROM movies WHERE movieId = ?`;

  db.get(query, [req.params.movieId], async (err: Error | null, row: any) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return;
    }
    if (!row) {
      res.status(404).send('Movie not found');
      return;
    }

    
    row.budget = row.budget ? `$${Number(row.budget).toLocaleString()}` : null;

    
    const ratings: any[] = [];
    try {
      // Local ratings API
      const localRes = await fetch(`http://localhost:3000/ratings/${row.movieId}`);
      if (localRes.ok) {
        const localRatings = await localRes.json();
        ratings.push({ source: 'local', ratings: localRatings });
      }
    } catch (e) {
      ratings.push({ source: 'local', error: 'Could not fetch local ratings' });
    }
    try {
      
      const omdbRes = await fetch(`https://www.omdbapi.com/?i=${row.imdbId}&apikey=YOUR_API_KEY`);
      if (omdbRes.ok) {
        const omdbData = await omdbRes.json();
        const rtRating = omdbData.Ratings?.find((r: any) => r.Source === 'Rotten Tomatoes');
        ratings.push({ source: 'OMDB', rating: rtRating ? rtRating.Value : 'N/A' });
      }
    } catch (e) {
      ratings.push({ source: 'OMDB', error: 'Could not fetch OMDB rating' });
    }

    res.send({
      movieId: row.movieId,
      imdbId: row.imdbId,
      title: row.title,
      overview: row.overview,
      releaseDate: row.releaseDate,
      budget: row.budget,
      runtime: row.runtime,
      genres: row.genres,
      language: row.language,
      productionCompanies: row.productionCompanies,
      ratings
    });
  });
};