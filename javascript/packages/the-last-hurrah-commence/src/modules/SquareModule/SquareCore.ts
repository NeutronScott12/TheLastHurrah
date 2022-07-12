import {
    DynamicModule,
    Global,
    Module,
    Provider,
    ValueProvider,
} from '@nestjs/common'
import { SQUARE_OPTIONS } from './constants'
import { PaymentProcessOptions } from './interfaces/payment-process-options.interface'
import { PaymentProcessorFactory } from './interfaces/payment-processor-factory.interface'
import { PaymentProcessAsyncOptions } from './interfaces/PaymentProcessAsyncOptions.interface'
import { PaymentService } from './services/payment.service'

@Global()
@Module({})
export class SquareModule {
    public static forRoot(options: PaymentProcessOptions): DynamicModule {
        const SquareOptionsProvider: ValueProvider<PaymentProcessOptions> = {
            provide: SQUARE_OPTIONS,
            useValue: options,
        }

        return {
            module: SquareModule,
            global: options.global,
            providers: [SquareOptionsProvider, PaymentService],
            exports: [PaymentService, SQUARE_OPTIONS],
        }
    }

    public static forRootAsync(
        options: PaymentProcessAsyncOptions,
    ): DynamicModule {
        const providers: Provider[] = this.createAsyncProviders(options)

        return {
            module: SquareModule,

            providers: [...providers, PaymentService],
            imports: options.imports,
            exports: [PaymentService, SQUARE_OPTIONS],
        }
    }

    private static createAsyncProviders(
        options: PaymentProcessAsyncOptions,
    ): Provider[] {
        const providers: Provider[] = [this.createAsyncOptionsProvider(options)]

        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass,
            })
        }

        return providers
    }

    private static createAsyncOptionsProvider(
        options: PaymentProcessAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                name: SQUARE_OPTIONS,
                provide: SQUARE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            }
        }

        return {
            name: SQUARE_OPTIONS,
            provide: SQUARE_OPTIONS,
            useFactory: async (optionsFactory: PaymentProcessorFactory) => {
                return optionsFactory.createPaymentOptions()
            },
            inject: [options.useExisting! || options.useClass],
        }
    }
}
