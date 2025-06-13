import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/common/dtos/auth/register-user.dto";
import { ApiResponce } from "src/common/dtos/api-responce.dto";
import { User, } from "../Users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

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
async verifyEmail(@Query('token') token: string): Promise<ApiResponce<Partial<User>>> {
    console.log("verfing email controller is working");

    if (!token) {
        throw new HttpException('Verification token is missing.', HttpStatus.BAD_REQUEST);
    }

    try {
        const verfieduser = await this.AuthService.verifyEmail(token);
        const responcedata: Partial<User> = {
            _id: verfieduser._id,
            email: verfieduser.email,
            fullName: verfieduser.fullName,
            is_verified: verfieduser.is_verified
        };
        console.log("Backend: About to send API Response.");
        return new ApiResponce(true, "User Verified Successfully", HttpStatus.OK, responcedata);
    } catch (error) {
        console.error("Email verification error:", error);

        let errorMessage = 'An unknown error occurred during email verification.';
        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof HttpException) {
            httpStatus = error.getStatus();
            if (httpStatus === HttpStatus.BAD_REQUEST) {
                if (error.message.includes('already verified')) {
                    errorMessage = 'This email has already been verified.';
                } else {
                    errorMessage = 'Invalid or expired verification token.';
                }
            } else if (httpStatus === HttpStatus.NOT_FOUND) {
                errorMessage = 'User not found for the provided token.';
            } else {
                errorMessage = error.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
            httpStatus = HttpStatus.BAD_REQUEST;
        }

        throw new HttpException(errorMessage, httpStatus);
    }
}

}