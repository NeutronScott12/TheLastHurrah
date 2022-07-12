import { ModuleMetadata, Type } from '@nestjs/common'
import { Configuration } from 'square'
import { PaymentProcessOptions } from './payment-process-options.interface'
import { PaymentProcessorFactory } from './payment-processor-factory.interface'

export interface PaymentProcessAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[]
    useClass?: Type<PaymentProcessorFactory>
    useExisting?: Type<PaymentProcessorFactory>
    useFactory: (
        ...args: any[]
    ) => Promise<PaymentProcessOptions> | PaymentProcessOptions
}
