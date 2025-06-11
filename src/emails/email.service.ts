import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer  from 'nodemailer'
import { SentMessageInfo, Options } from "nodemailer/lib/smtp-transport";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;
  private appBaseUrl: string;
  private frontendUrl: string;
  private senderEmail: string;

  constructor(private ConfigService:ConfigService){
    this.appBaseUrl = this.ConfigService.get<string>('app.baseUrl') || ""
    this.frontendUrl = this.ConfigService.get<string>('app.frontendUrl') || ""
    this.senderEmail = this.ConfigService.get<string>('email.user') || ""

    this.transporter = nodemailer.createTransport({
        service: "gmail",
      auth: {
        user: this.ConfigService.get<string>('email.user') ,
        pass: this.ConfigService.get<string>('email.pass'),
      },
    })
  }


  private async sendEmail(to:string, subject:string, htmlContent:string, from?:string): Promise<void> {
    const mailOptions = {
      from: from || `"FobVerse" <${this.senderEmail}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };
     try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to} with subject: "${subject}"`);
    } catch (error) {
      console.error(`Failed to send email to ${to} with subject "${subject}":`, error);
      throw new InternalServerErrorException('Failed to send email.');
    }
  }

    async sendUserVerificationEmail(to: string, verificationjwt: string): Promise<void> {
    const verificationLink = `${this.appBaseUrl}/auth/verify-email?token=${verificationjwt}`;
    const subject = 'Verify Your Email Address for Your App Name';
    const htmlContent = `
      <p>Hello,</p>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <p><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>${verificationLink}"</P>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not register for this account, please ignore this email.</p>
    `;
    await this.sendEmail(to, subject, htmlContent);
  }

}