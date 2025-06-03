import { UserDocument } from "src/modules/Users/entities/user.entity";
import { RegisterUserDto } from "../dtos/auth/register-user.dto";



export interface UserRepository {
   createUser(dto: RegisterUserDto) :Promise<UserDocument>;
   findbyEmail(email:string):Promise<UserDocument | null>
}  