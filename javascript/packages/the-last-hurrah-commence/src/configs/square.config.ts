import { ConfigModule, ConfigService } from '@nestjs/config'
import { Environment } from 'square'
import { PaymentProcessAsyncOptions } from 'src/modules/SquareModule/interfaces/PaymentProcessAsyncOptions.interface'
import { PaymentProcessOptions } from '../modules/SquareModule/interfaces/payment-process-options.interface'
import { configOptions } from './config'

class getSquareConfig {
    static getConfig(configService: ConfigService): PaymentProcessOptions {
        return {
            square: {
                environment: Environment.Sandbox,
                accessToken: configService.get('SQUARE_ACCESS_TOKEN'),
            },
            global: true,
        }
    }
}

export const getSquareAsyncOptions: PaymentProcessAsyncOptions = {
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: (configService: ConfigService) =>
        getSquareConfig.getConfig(configService),
    inject: [ConfigService],
}
