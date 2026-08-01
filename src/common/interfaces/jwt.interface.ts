import { Request } from 'express';

export interface JWTPayload {
  sub: string;
}

export interface AuthenticatedRequest extends Request {
  user: string;
}
