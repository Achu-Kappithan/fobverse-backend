import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../Users/entities/user.entity';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/modules/Auth/candidate/register-user.dto';

@Injectable()
export class AuthUserRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  // method for createing new user
  async createUser(
    dto: RegisterUserDto & {
      is_verified?: boolean;
      verificationToken?: string;
      verificationTokenExpires?: Date;
    },
  ): Promise<UserDocument> {
    const newUser = new this.UserModel(dto);
    return newUser.save();
  }

  // find user by emalil
  async findbyEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email });
  }

  //saving user
  async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }

  // find user by id
  async findById(id: string): Promise<UserDocument | null> {
    console.log('id for finding the user', id);
    const val = this.UserModel.findById({ id });
    console.log('user from the db', val);
    return val;
  }

  //find user by id
  async findOne(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ _id: id });
  }
}
