import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserRepository } from './auth.repository';
import { CandidateLoginDto, RegisterUserDto } from 'src/modules/Auth/candidate/register-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../../Users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from 'src/common/events/userRegisterd.events';
import { ConfigService } from '@nestjs/config';
import { jwtTokenPayload, TokenPayload } from 'src/common/Interfaces/jwt/IToken';
import { JwtTokenService } from 'src/common/services/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly AuthRepository: AuthUserRepository,
    private eventEmitter: EventEmitter2,
    private ConfigService: ConfigService,
    private jwtService : JwtTokenService
  ) {}

  // for register a new  candidate
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

      const payload: TokenPayload = {
        sub: newUser._id.toString(),
        email: newUser.email,
        type: 'email_varification',
      };

      const varificationjwt = await this.jwtService.genereateVerificationToken(payload)

      this.eventEmitter.emit(
        'user.registered',
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
      console.error(
        'Database or JWT generation error during registration:',
        error,
      );
      throw new InternalServerErrorException(
        'Failed to register user due to an internal issue.',
      );
    }
  }

  // candidate email verification

  async verifyEmail(token: string): Promise<UserDocument> {
    try {

      let payload =  this.jwtService.verifyVerificationToken(token)

      console.log('Token Paylodoo', payload);

      if (payload.type !== 'email_varification') {
        console.log('missmath payload');
        throw new BadRequestException('Invalid token purpose.');
      }

      const user = await this.AuthRepository.findOne(payload.sub);
      console.log('user wait for verification ', user);

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if (user.is_verified) {
        throw new BadRequestException('Email is already verified.');
      }

      user.is_verified = true;
      await this.AuthRepository.save(user);
      console.log('in service fiele user after verification', user);
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification link.');
    }
  }

  // for candidate login

  async candidateLogin(dto:CandidateLoginDto): Promise<{ user: Omit<User, 'password'>; jwtToken: string; refreshToken: string }> {
    try {
      console.log("user login details get from the servicefile",dto)
      const {email, password} = dto

      const user = await this.AuthRepository.findbyEmail(email)
      console.log("user get from the db",user)
      if(!user){
        throw new UnauthorizedException("Invalid Credetials")
      }

      if(!user.is_verified){
        throw new UnauthorizedException("Email not verified. Please verify your email to log in.")
      }

      const isPasswordValid = await bcrypt.compare(password,user.password!);
      if(!isPasswordValid){
        throw new UnauthorizedException('Invalid Credentials')
      }

      const payload :jwtTokenPayload = {
        id : user._id.toString(),
        email : user.email,
        is_verified : user.is_verified
      }

      const jwtToken = this.jwtService.generateJwtToken(payload)
      const refreshToken = this.jwtService.genereateRefreshtoken(payload)

      const { password: userPassword, ...userData } = user.toObject ? user.toObject() : user;
        return {
        user: userData as Omit<User, 'password'>, 
        jwtToken: jwtToken,
        refreshToken: refreshToken,
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
       console.error('An unexpected error occurred during candidate login:', error);
      throw new InternalServerErrorException('An internal server error occurred during login.');
    }
  }

}
