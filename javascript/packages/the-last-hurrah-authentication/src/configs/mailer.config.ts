import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerOptions } from '@nestjs-modules/mailer'
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface'
import * as sendgridTransport from 'nodemailer-sendgrid-transport'

import { configOptions } from '.'
class MailOptions {
    static getMailOptions(configService: ConfigService): MailerOptions {
        let transport =
            process.env.NODE_ENV === 'development'
                ? {
                      host: configService.get('MAIL_HOST'),
                      port: configService.get('MAIL_PORT'),
                      auth: {
                          user: configService.get('AUTH_USER'),
                          pass: configService.get('AUTH_PASS'),
                      },
                  }
                : sendgridTransport({
                      host: 'smtp.sendgrid.net',
                      port: 465,
                      secure: true,
                      auth: {
                          api_key: configService.get('SEND_GRID_API_KEY'),
                      },
                  })

        return {
            transport,
        }
    }
}

export const AsyncMailOptions: MailerAsyncOptions = {
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: (configService: ConfigService) =>
        MailOptions.getMailOptions(configService),
    inject: [ConfigService],
}
