import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../Users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUserRepository } from './auth.repository';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtTokenService } from 'src/common/services/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    EventEmitterModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUserRepository,JwtTokenService],
  exports: [AuthService, AuthUserRepository,JwtTokenService],
})
export class AuthModule {}
