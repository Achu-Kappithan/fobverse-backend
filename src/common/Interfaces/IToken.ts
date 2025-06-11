import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: string;
}
