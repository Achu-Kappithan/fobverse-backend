import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../Users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthUserRepository } from "./auth.repository";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
    imports : [MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        ConfigModule,
        EventEmitterModule
    ],
    controllers: [AuthController],
    providers: [AuthService,AuthUserRepository],
    exports: [AuthService,AuthUserRepository]
})

export class AuthModule {}