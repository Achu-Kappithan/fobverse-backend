import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../Users/entities/user.entity";
import { Model } from "mongoose";
import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";

@Injectable()
export class AuthUserRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: Model<UserDocument>) {}

    async createUser(dto:RegisterUserDto): Promise<UserDocument>{
        const newUser = new this.UserModel(dto);
        return newUser.save()
    }

    async findbyEmail(email:string): Promise<UserDocument | null>{
        return this.UserModel.findOne({email})
    }
}