import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = (request: NextRequest): JwtPayload | null => {
  try {
    const token = request.cookies.get('token')?.value || '';

    if (!token) {
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};