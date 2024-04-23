import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = `511`;

    if (!apiKey || apiKey !== validApiKey) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }
    
    

    next();
  }
}
