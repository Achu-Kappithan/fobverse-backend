import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type UserDocument = HydratedDocument<User>

@Schema({timestamps:true})
export class User {
    @Prop({required: true})
    fullName: string

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

    _id?:string
}

export const UserSchema = SchemaFactory.createForClass(User)
