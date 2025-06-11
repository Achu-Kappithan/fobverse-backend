import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserRepository } from './auth.repository';
import { RegisterUserDto } from 'src/common/dtos/auth/register-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../Users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from 'src/common/events/userRegisterd.events';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/common/Interfaces/IToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly AuthRepository: AuthUserRepository,
    private eventEmitter: EventEmitter2,
    private ConfigService: ConfigService,
  ) {}

  async register(userDto: RegisterUserDto): Promise<User> {
    console.log('data in the regiser service ', userDto);
    const { email, password } = userDto;

    const existingUser = await this.AuthRepository.findbyEmail(email);
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    let hashtpassword: string | undefined;
    if (password) {
      const saltround = 10;
      hashtpassword = await bcrypt.hash(password, saltround);
    }

    try {
      const newUser = await this.AuthRepository.createUser({
        ...userDto,
        password: hashtpassword,
        is_verified: false,
      });

      const jwtVerificationSecret = this.ConfigService.get<string>('JWT_VERIFICATION_SECRET');
      const jwtVerificationExpiresIn = this.ConfigService.get<string>('JWT_VERIFICATION_EXPIRES_IN');

      if (!jwtVerificationSecret) {
        console.error('SERVER CONFIG ERROR: JWT verification secret is not defined!');
        throw new InternalServerErrorException('Server configuration error: JWT secret missing.');
      }
      if (!jwtVerificationExpiresIn) {
        console.error('SERVER CONFIG ERROR: JWT verification expiration time is not defined!');
        throw new InternalServerErrorException('Server configuration error: JWT expiry time missing.');
      }
     
      const payload: TokenPayload = {
        sub: newUser._id.toString(),
        email: newUser.email,
        type: 'email_varification',
      };

      const varificationjwt = jwt.sign(
        payload,
        jwtVerificationSecret,
        {
          expiresIn:  '1d',
        },
      );
      this.eventEmitter.emit(
        "user.registered",
        new UserRegisteredEvent(
          newUser._id.toString(),
          newUser.email,
          varificationjwt,
        ),
      );
      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
          throw error;
      }
      console.error('Database or JWT generation error during registration:', error);
      throw new InternalServerErrorException('Failed to register user due to an internal issue.',)
    }
  }

  async verifyEmail(token: string): Promise<UserDocument> {
    try {
      const secret = this.ConfigService.get<string>('jwt.verificationSecret');
      if (!secret) {
        throw new Error('jwt secret is not provided');
      }

      let payload = jwt.verify(token,secret) as TokenPayload;
      console.log("Token Paylodoo",payload)
      if (payload.type !== 'email_varification') {
        console.log("missmath payload")
        throw new BadRequestException('Invalid token purpose.');
      }
  
      const user = await this.AuthRepository.findOne(payload.sub);
      console.log("user wait for verification ",user)
  
      if (!user) {
        throw new NotFoundException('User not found.');
      }
  
      if (user.is_verified) {
        throw new BadRequestException('Email is already verified.');
      }
  
      user.is_verified = true;
      await this.AuthRepository.save(user);
  
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification link.');
    }
  }
}
