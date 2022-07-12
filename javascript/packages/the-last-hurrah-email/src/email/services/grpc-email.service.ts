import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { EMAIL_GRPC_SERVICE, EMAIL_PACKAGE } from 'src/constants'
import { IEmailService } from '../proto/email-grpc.types'

@Injectable()
export class GrpcEmailService implements OnModuleInit {
    emailService: IEmailService

    constructor(@Inject(EMAIL_PACKAGE) private grpcClient: ClientGrpc) {}

    onModuleInit() {
        this.emailService =
            this.grpcClient.getService<IEmailService>(EMAIL_GRPC_SERVICE)
    }
}
