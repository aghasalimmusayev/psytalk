import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailService: MailerService) { }

    async sendWelcome(email: string, firstName: string, verificationToken: string) {
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
        await this.mailService.sendMail({
            to: email,
            subject: '🎉 PSYTALK-ə Xoş Gəldiniz!',
            template: './welcome',
            context: {
                firstName,
                email,
                platformUrl: process.env.CLIENT_URL ?? 'https://psytalk.az',
                verifyUrl
            }
        })
    }

    async sendEmailVerified(email: string, firstName: string) {
        await this.mailService.sendMail({
            to: email,
            subject: '✅ Email ünvanınız təsdiqləndi',
            template: './emailVerified',
            context: {
                firstName,
                platformUrl: process.env.CLIENT_URL ?? 'https://psytalk.az'
            }
        })
    }

    async sendResetLink(email: string, firstName: string, token: string) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`
        await this.mailService.sendMail({
            to: email,
            subject: '🔐 Şifrə Sıfırlama — PSYTALK',
            template: './passwordReset',
            context: {
                firstName,
                resetUrl,
                platformUrl: process.env.CLIENT_URL ?? 'https://psytalk.az'
            }
        })
    }

    async sendPasswordChanged(email: string, firstName: string) {
        await this.mailService.sendMail({
            to: email,
            subject: '🔒 Şifrəniz dəyişdirildi — PSYTALK',
            template: './passwordChanged',
            context: {
                firstName,
                platformUrl: process.env.CLIENT_URL ?? 'https://psytalk.az'
            }
        })
    }
}
