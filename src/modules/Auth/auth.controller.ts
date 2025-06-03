import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly AuthService:AuthService) {}

    @Post("registeruser")
    async registerUser(@Body(new ValidationPipe())userdto :RegisterUserDto): Promise<any>{
        return this.AuthService.register(userdto)
    }
}