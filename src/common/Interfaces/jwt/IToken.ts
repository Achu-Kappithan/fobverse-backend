import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: string;
}

export interface jwtTokenPayload extends JwtPayload {
  id:string;
  email:string;
  is_verified:boolean;
}




