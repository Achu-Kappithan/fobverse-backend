import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./email.service";
import { EmailListener } from "./email.listener";
import { EventEmitterModule } from "@nestjs/event-emitter";


@Module({
    imports :[ConfigModule,EventEmitterModule],
    providers :[EmailService,EmailListener],
    exports: [EmailService]
}) 
export class EmailModule {}