'use strict';

import { Database } from 'sqlite3';
import { Request, Response } from 'express';

export const getGenreList = (db: Database, req: Request, res: Response): void => {
  const query = 'SELECT * FROM movies;';

  db.all(query, [], (err: Error | null, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'No movies found' });
    }
    const genreList: any[] = [];
    for (const row of rows) {
      try {
        const genres = JSON.parse(row.genres);
        for (const genre of genres) {
          if (!genreList.find(listItem => listItem.name === genre.name)) {
            genreList.push(genre);
          }
        }
      } catch (e) {
        // Fallback: skip row if genres cannot be parsed
        continue;
      }
    }
    if (genreList.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'No genres found' });
    }
    res.json(genreList);
  });
};