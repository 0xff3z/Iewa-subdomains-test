import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = `0e5e37e293db3f0bf9f5877902ea9b7da4bca0e32f561725c8ea6d561eb3a170`;

    if (!apiKey || apiKey !== validApiKey) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }
    
    

    next();
  }
}
