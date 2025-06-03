import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type UserDocument = HydratedDocument<User>

@Schema({timestamps:true})
export class User {
    @Prop({required: true})
    username: string

    @Prop({required: true, unique:true })
    email: string

    @Prop({required: false})
    password?:string

    @Prop({required:false})
    googleId?:string

    @Prop({default: false})
    is_verified: boolean

    @Prop({default:false})
    is_superAdmin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)