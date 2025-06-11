import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";
import { ApiResponce } from "src/common/dtos/api-responce.dto";
import { User, } from "../Users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly AuthService:AuthService, private configService:ConfigService) {}

    @Post("registeruser")
    async registerUser(@Body(new ValidationPipe())userdto :RegisterUserDto): Promise<ApiResponce<Partial<User>>>{
        try {
            const registeredUser = await this.AuthService.register(userdto)
            const responcedata :Partial<User>={
                _id :registeredUser._id,
                email: registeredUser.email,
                fullName: registeredUser.fullName,
                is_verified : registeredUser.is_verified
            }
            return new ApiResponce(true,"User registered successfully. Please verify your email.",HttpStatus.CREATED,responcedata)
        } catch (error) {
            console.error("Error from registration controller:", error);
            if (error instanceof HttpException) {
                throw error; 
            }
            throw new HttpException(
                error.message || "User registration failed due to an unexpected error.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );        
        }
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Res() res: Response): Promise<void> {
        const frontendUrl = this.configService.get<string>('app.frontendUrl');

        if (!token) {
            return res.redirect(`${frontendUrl}/verification-failed?reason=missing_token`);
        }

        try {
            await this.AuthService.verifyEmail(token);
            return res.redirect(`${frontendUrl}/email-verification-success`);
        } catch (error) {
            console.error("Email verification error:", error);
            let reason = 'unknown_error';
            if (error instanceof HttpException) {
                if (error.getStatus() === HttpStatus.BAD_REQUEST) {
                    reason = 'invalid_or_expired'; 
                    if (error.message.includes('already verified')) {
                        reason = 'already_verified';
                    }
                } else if (error.getStatus() === HttpStatus.NOT_FOUND) {
                    reason = 'user_not_found';
                }
            }
            return res.redirect(`${frontendUrl}/verification-failed?reason=${reason}`);
        }
    }
}