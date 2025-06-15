import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { jwtTokenPayload, TokenPayload } from "../Interfaces/jwt/IToken";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtTokenService {
    constructor(private readonly configService:ConfigService,){}

    // Email verification Token Generation

    genereateVerificationToken(payload:TokenPayload):string{
        const secret = this.configService.get<string>('JWT_VERIFICATION_SECRET')

        if(!secret){
            throw new InternalServerErrorException('Server configuration error: JWT verification secret is not defined!')
        }
        return jwt.sign(payload,secret,{expiresIn:'6h'})
    }

    // verify email throw jwt token

    verifyVerificationToken(token:string):TokenPayload{
        const secret = this.configService.get<string>('JWT_VERIFICATION_SECRET')

        if(!secret){
            throw new InternalServerErrorException('Server configuration error: JWT verification secret is not defined!')
        }
        return  jwt.verify(token,secret) as TokenPayload
    }

    // Generat jwt token

    generateJwtToken(payload:jwtTokenPayload):string{
        const secret = this.configService.get<string>('jwt.authSecret')

        if(!secret){
            throw new InternalServerErrorException('Server configuration error: JWT verification secret is not defined!')
        }
        return jwt.sign(payload,secret,{expiresIn:'7d'})
    }

    // genereate refresh token 

    genereateRefreshtoken(payload:jwtTokenPayload):string{
        const secret =  this.configService.get<string>('jwt.refreshSecret')

        if(!secret){
            throw new InternalServerErrorException('Server configuration error: JWT verification secret is not defined!')
        }
        return jwt.sign(payload,secret,{expiresIn:'7d'})
    }
}