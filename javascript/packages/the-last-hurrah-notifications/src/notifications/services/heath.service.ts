import { Injectable } from '@nestjs/common'
import {
    HealthCheckResponse,
    IHealthService,
    ServingStatus,
} from '../proto/types'

@Injectable()
export class HealthService implements IHealthService {
    check(): HealthCheckResponse {
        return {
            status: ServingStatus.SERVING,
        }
    }
}
