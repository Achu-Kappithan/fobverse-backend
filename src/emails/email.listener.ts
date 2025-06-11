import { OnEvent } from "@nestjs/event-emitter";
import { EmailService } from "./email.service";
import { Injectable } from "@nestjs/common";
import { UserRegisteredEvent } from "src/common/events/userRegisterd.events";

@Injectable()
export class EmailListener {
    constructor(private readonly emailService:EmailService){
    }

    @OnEvent("user.registered")
    async handleUserRegisteredEvent (event: UserRegisteredEvent){
        console.log(`[EmailListener] received userregistered event:${event.email}`)
        try {
            this.emailService.sendUserVerificationEmail(event.email,event.varificationjwt)
            console.log(`[EmailListener] Verification email successfully triggered for ${event.email}`);
        } catch (error) {
          console.error(`[EmailListener] Error sending verification email for ${event.email}:`, error);  
        }
    }
}