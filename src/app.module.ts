import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseModule } from './database/database.module';
import { AuthModule } from './modules/Auth/auth.module';
import { UserModule } from './modules/Users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:(config: ConfigService) =>({
        uri:config.get<string>('MONGO_URI')
      }),
      inject :[ConfigService]
    }),
    databaseModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
