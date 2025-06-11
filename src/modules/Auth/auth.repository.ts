import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../Users/entities/user.entity";
import { Model } from "mongoose";
import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";

@Injectable()
export class AuthUserRepository {
    constructor(@InjectModel(User.name) private readonly UserModel: Model<UserDocument>) {}

    // method for createing new user
    async createUser(dto:RegisterUserDto & {is_verified?:boolean,verificationToken?:string,verificationTokenExpires?:Date}): Promise<UserDocument>{
        const newUser = new this.UserModel(dto);
        return newUser.save()
    }

    async findbyEmail(email:string): Promise<UserDocument | null>{
        return this.UserModel.findOne({email})
    }

    async save(user:UserDocument):Promise<UserDocument>{
        return user.save()
    }

    async findById(id:string):Promise<UserDocument | null>{
        console.log("id for finding the user",id)
         const val =this.UserModel.findById({id})
         console.log("user from the db",val)
         return val
    }

    async findOne(id:string):Promise<UserDocument | null> {
        return  this.UserModel.findOne({_id:id})
        
    }
}