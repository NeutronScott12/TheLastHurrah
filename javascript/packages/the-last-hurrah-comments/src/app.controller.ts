import { Controller, Get } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'
import {
    HealthCheckService,
    HealthCheck,
    GRPCHealthIndicator,
} from '@nestjs/terminus'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'

@Controller('/health')
export class AppController {
    constructor(
        private microServiceCheck: GRPCHealthIndicator,
        private health: HealthCheckService,
    ) {}

    @Public()
    @Get()
    @HealthCheck()
    check_grpc() {
        return this.health.check([
            () =>
                this.microServiceCheck.checkService('Health', 'grpc.health.v1'),
            () =>
                this.microServiceCheck.checkService(
                    'NotificationService',
                    'notification',
                ),
        ])
    }
}
