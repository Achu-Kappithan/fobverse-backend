import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseModule } from './database/database.module';
import { AuthModule } from './modules/Auth/auth.module';
import { UserModule } from './modules/Users/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './emails/email.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load : [configuration]
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:(config: ConfigService) =>({
        uri:config.get<string>('MONGO_URI')
      }),
      inject :[ConfigService]
    }),
    databaseModule,
    AuthModule,
    UserModule,
    EmailModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
