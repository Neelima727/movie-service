'use strict';

import { Database } from 'sqlite3';
import { Request, Response } from 'express';

export const getRating = (db: Database, req: Request, res: Response): void => {
  const query = 'SELECT * FROM ratings WHERE movieId = ?';

  db.all(query, [req.params.movieId], (err: Error | null, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'No ratings found' });
    }
    res.json(rows);
  });
};