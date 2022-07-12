import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { grpClient } from 'src/configs/grpClient.config'

@Module({
    imports: [ClientsModule.register(grpClient)],
    providers: [],
})
export class GrpcModule {
    constructor() {}

    static registerGrpc() {}

    static registerAsyncGrpc() {}
}
