import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { configOptions } from './configs/config'
import { asyncGraphqlOptions } from './configs/graphql.config'
import { CommentsModule } from './comments/comments.module'
import { AuthModule } from './auth/auth.module'
import { ClientsModule } from '@nestjs/microservices'
import { GrpcClientOptions } from './configs/grpcClient.config'
import { UserService } from './comments/services/user.service'
import { ThreadModule } from './thread/thread.module'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'

@Module({
    imports: [
        ThreadModule,
        CommentsModule,
        ConfigModule.forRoot(configOptions),
        // GraphQLModule.forRootAsync(asyncGraphqlOptions),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,

            // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            autoSchemaFile: 'schema.gql',
            subscriptions: {
                'graphql-ws': true,
            },
        }),
        AuthModule,
        ClientsModule.register(GrpcClientOptions),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
