import {
    INestApplication,
    Injectable,
    OnModuleInit,
    Logger,
} from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
            errorFormat: 'colorless',
        })
    }

    async onModuleInit() {
        await this.$connect()
        // this.$on<any>('query', (event: Prisma.QueryEvent) => {
        //     Logger.log(`Query: ${event.query} ${event.duration}ms`, 'PRISMA')
        // })
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }
}
