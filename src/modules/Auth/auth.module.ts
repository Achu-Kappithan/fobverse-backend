import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../Users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthUserRepository } from "./auth.repository";

@Module({
    imports : [MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
    controllers: [AuthController],
    providers: [AuthService,AuthUserRepository]
})

export class AuthModule {}