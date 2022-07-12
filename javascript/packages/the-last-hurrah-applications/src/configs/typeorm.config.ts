// import { ConfigModule, ConfigService } from '@nestjs/config'
// import {
//     TypeOrmModuleAsyncOptions,
//     TypeOrmModuleOptions,
// } from '@nestjs/typeorm'
// import { ApplicationModel } from 'src/application/entities/application.entity'
// import { LoggerOptions } from 'typeorm'

// console.log('ENV', process.env.NODE_ENV)

// export default class TypeOrmConfig {
//     static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
//         console.log(configService.get('DATABASE_URL'))

//         return {
//             type: 'postgres',
//             // url: configService.get('DATABASE_URL'),
//             host: configService.get('DB_HOST') || 'localhost',
//             port: configService.get('DB_PORT') || 5433,
//             username: configService.get('DB_USERNAME'),
//             password: configService.get('DB_PASSWORD'),
//             database: configService.get('DB_NAME'),
//             entities: [ApplicationModel],
//             synchronize: true,
//             migrationsRun: true,
//             cache: true,
//             // configService.get<boolean>('TYPEORM_SYNCHRONIZE') || false,
//             logging: true,
//             // configService.get<LoggerOptions>('TYPEORM_LOGGING') || false,
//         }
//     }
// }

// export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
//     imports: [ConfigModule],
//     useFactory: async (
//         configService: ConfigService,
//     ): Promise<TypeOrmModuleOptions> =>
//         TypeOrmConfig.getOrmConfig(configService),
//     inject: [ConfigService],
// }
