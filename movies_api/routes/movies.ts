'use strict';

import { Database } from 'sqlite3';
import { Request, Response } from 'express';

export const getAllMovies = (db: Database, req: Request, res: Response): void => {
  const query = 'SELECT * FROM movies LIMIT 100;';

  db.all(query, [], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return; // Ensure to return after sending a response
    }

    console.log(rows);
    if (rows.length === 0) {
      res.status(404).send('No movies found'); // Send a response for 404
      return; // Ensure to return after sending a response
    }

    res.send(rows);
  });
};

export const getMovie = (db: Database, req: Request, res: Response): void => {
  const query = 'SELECT * FROM movies WHERE movieId = ?';

  db.all(query, [req.params.movieId], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
      return; // Ensure to return after sending a response
    }

    if (rows.length === 0) {
      res.status(404).send('Movie not found'); // Send a response for 404
      return; // Ensure to return after sending a response
    }

    res.send(rows);
  });
};