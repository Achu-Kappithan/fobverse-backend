import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthUserRepository } from "./auth.repository";
import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly AuthRepository:AuthUserRepository){}

    async register(userDto:RegisterUserDto): Promise<any>{
        const {email, password} = userDto

        const existingUser = await this.AuthRepository.findbyEmail(email);
        if(existingUser){
            throw new HttpException("User with this email already exists",HttpStatus.CONFLICT)
        }

        let hashtpassword: string | undefined 
        if(password){
            const saltround  = 10
            hashtpassword = await bcrypt.hash(password,saltround)
            console.log(hashtpassword)
        }
        return this.AuthRepository.createUser({...userDto,password:hashtpassword})

        
    }
}