import { Prisma, User } from '.prisma/client'
import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common'
import {
    comparePassword,
    createToken,
    EmailSchema,
    hashPassword,
    LoginSchema,
} from '@thelasthurrah/the-last-hurrah-shared'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import { append } from 'ramda'

import { PrismaService } from '../../prisma/prisma.service'
import { ApplicationService } from './application.service'
import { AuthEmailProducer } from '../producers/auth-email.producer'
import {
    AUTHENTICATION_CACHE_KEY,
    CHECK_EMAIL_CODE,
    INVALID_CREDENTIALS,
    JWT_SECRET,
    SUCCESSFULLY_LOGGED_IN,
    TWO_FACTOR_CACHE_KEY,
    USER_BLOCKED,
    USER_DOES_NOT_EXIST,
} from '../../constants'
import { errorHandler } from '../../helpers/errorHandler'
import { LoginResponseUnion } from '../dto/unions/login-response.union'
import { application } from 'express'
import { ICheckValidUserResponse } from '../proto/application/application_grpc_types'
import { checkApplicationExists } from '../helpers'

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly applicationService: ApplicationService,
        private readonly authEmailProducer: AuthEmailProducer,
        private readonly configService: ConfigService,
    ) {}

    async findUniqueUser(args: Prisma.UserFindUniqueArgs) {
        return this.prisma.user.findUnique(args)
    }

    async findUser(args: Prisma.UserFindFirstArgs) {
        return this.prisma.user.findFirst(args)
    }

    async findUsers(args: Prisma.UserFindManyArgs) {
        return this.prisma.user.findMany(args)
    }

    async updateUser(args: Prisma.UserUpdateArgs) {
        return this.prisma.user.update(args)
    }

    async delete(args: Prisma.UserDeleteArgs) {
        const user = await this.findUser({ where: { email: args.where.email } })

        await this.cacheManager.store.del(
            `${AUTHENTICATION_CACHE_KEY}:${user.id}`,
        )

        await this.applicationService.removeUserFromAllApplications({
            application_ids: user.applications_joined_ids,
            user_id: user.id,
        })

        return this.prisma.user.delete(args)
    }

    async findApplicationMembers({
        applications_joined_ids,
    }: Prisma.UserWhereInput) {
        return this.prisma.user.findMany({
            where: { applications_joined_ids },
        })
    }

    async register(
        {
            data: {
                password,
                username,
                email,
                two_factor_authentication,
                user_ip,
            },
        }: Prisma.UserCreateArgs,
        application_id?: string,
        application_short_name?: string,
    ) {
        try {
            const hashedPassword = await hashPassword(password)

            const user = await this.prisma.user.create({
                data: {
                    last_active: new Date(),
                    avatar: {
                        create: {
                            url: 'https://res.cloudinary.com/dmxf3jh8t/image/upload/v1551876589/qzlmu4vxyomehxuo3tat.jpg',
                            ETag: 'fad75a1508f411e02d26d8d67a0add40',
                            encoding: 'jpg',
                            filename: 'default_avatar_url',
                            mimetype: 'image/jpeg',
                            default_avatar: true,
                            key: '1',
                        },
                    },
                    two_factor_authentication,
                    username,
                    email,
                    password: hashedPassword,
                    user_ip,
                },
            })

            if (process.env.NODE_ENV === 'test') {
                this.updateUser({
                    where: {
                        email,
                    },
                    data: {
                        confirmed: true,
                    },
                })

                return user
            }

            if (this.configService.get('NODE_ENV') !== 'test') {
                this.authEmailProducer.sendConfirmationEmailQueue({
                    username,
                    email,
                    id: user.id,
                })
            }

            if (application_id || application_short_name) {
                this.applicationService.setAuthenticatedUser({
                    application_id,
                    user_id: user.id,
                    application_short_name,
                })

                //@TODO return application id
                // return this.prisma.user.update({
                //     where: {
                //         id: user.id,
                //     },
                //     data: {
                //         applications_joined_ids: {
                //             push: application_id,
                //         },
                //     },
                // })
            }

            return user
        } catch (error) {
            errorHandler(error)
        }
    }

    async login(
        { email, password }: Prisma.UserWhereInput,
        application_short_name: string,
        request_ip?: string,
    ): Promise<typeof LoginResponseUnion> {
        try {
            await LoginSchema.validate({
                email,
                password,
            })

            const user = await this.prisma.user.findFirst({
                where: {
                    email,
                },
                include: { avatar: true, blocked_users: true },
            })

            const validPassword = await comparePassword(
                password as string,
                user.password,
            )

            if (!validPassword) {
                throw new ForbiddenException(INVALID_CREDENTIALS)
            }

            let check_application: ICheckValidUserResponse

            if (application_short_name) {
                check_application = await checkApplicationExists(
                    application_short_name,
                    this.applicationService,
                    user.id,
                )
            }

            if (
                this.configService.get('NODE_ENV') === 'production' &&
                request_ip
            ) {
                if (request_ip !== user.user_ip) {
                    this.authEmailProducer.sendEmailUnknownClientLogin({
                        email: user.email,
                        user_ip: user.user_ip,
                    })
                }
            }

            console.log('cacheManager', this.cacheManager)

            if (user) {
                const cache_result = await this.cacheManager.get<{
                    user: {
                        confirmed: boolean
                        id: string
                        email: string
                    }
                }>(`${AUTHENTICATION_CACHE_KEY}:${user.id}`)

                console.log('cache_result', cache_result)

                if (cache_result !== null) {
                    await this.cacheManager.del(
                        `${AUTHENTICATION_CACHE_KEY}:${user.id}`,
                    )
                }

                const { id, confirmed, username, email } = user

                await this.updateUser({
                    where: {
                        id,
                    },
                    data: {
                        status: 'ONLINE',
                    },
                })

                if (user.two_factor_authentication) {
                    await this.authEmailProducer.sendTwoFactorIdEmail({
                        user_id: user.id,
                        email: user.email,
                    })
                    return {
                        success: true,
                        two_factor_authentication: true,
                        message: CHECK_EMAIL_CODE,
                    }
                }

                let secretKey: string

                if (application_short_name && check_application.auth_secret) {
                    secretKey = check_application.auth_secret
                } else {
                    secretKey = this.configService.get('JWT_SECRET')
                }

                let application_id: string

                if (check_application) {
                    application_id = check_application.application_id
                        ? check_application.application_id
                        : ''
                }

                console.log('SECRET_KEY', secretKey)

                const [token, refresh_token] = createToken(
                    {
                        user_id: id,
                        username,
                        email,
                        confirmed,
                        application_id,
                    },
                    secretKey,
                    { expiresIn: '7d' },
                    'my_refresh_secret',
                    { id, username, email, confirmed },
                )

                const result = {
                    success: true,
                    message: SUCCESSFULLY_LOGGED_IN,
                    refresh_token,
                    two_factor_authentication: false,
                    token,
                    user,
                }

                await this.cacheManager.set(
                    `${AUTHENTICATION_CACHE_KEY}:${id}`,
                    result,
                    {
                        ttl: 604800,
                    },
                )

                return result
            } else {
                throw new NotFoundException({
                    success: false,
                    message: USER_DOES_NOT_EXIST,
                })
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    async two_factor_login(
        { email }: Prisma.UserWhereUniqueInput,
        uid: string,
    ) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } })

            const cacheUid = await this.cacheManager.get(
                `${TWO_FACTOR_CACHE_KEY}:${user.id}`,
            )

            if (cacheUid === uid) {
                await this.cacheManager.store.del(
                    `${TWO_FACTOR_CACHE_KEY}:${user.id}`,
                )
            } else {
                throw new ForbiddenException({
                    success: false,
                    message: 'Invalid ID',
                })
            }

            if (user) {
                const { id, confirmed, username } = user
                await this.updateUser({
                    where: {
                        id,
                    },
                    data: {
                        status: 'ONLINE',
                    },
                })

                const [token, refresh_token] = createToken(
                    { user_id: id, username, email, confirmed },
                    JWT_SECRET,
                    {},
                    'my_refresh_secret',
                    { user_id: id, username, email, confirmed },
                )

                return {
                    success: true,
                    message: 'Successfully logged in',
                    two_factor_authentication: true,
                    refresh_token,
                    token,
                    user,
                }
            } else {
                throw new NotFoundException({
                    success: false,
                    message: USER_DOES_NOT_EXIST,
                })
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async forgotPassword(email: string) {
        await EmailSchema.validate({
            email,
        })

        return this.prisma.user.findFirst({
            where: {
                email,
            },
        })
    }

    async resetPassword(password: string, email: string) {
        try {
            const user = await this.findUser({
                where: {
                    email,
                },
            })

            const newPassword = await hashPassword(password)

            const matches = user.old_password.some(
                async (password) =>
                    await comparePassword(newPassword, password),
            )

            if (matches) {
                throw new NotAcceptableException({
                    success: false,
                    message: 'Previously used passwords are not acceptable',
                })
            }

            // console.log('MATCHES', matches)
            // console.log('USER', user)

            // const oldPasswords = append(user.password, user.old_password)

            // console.log('OLD_PASSWORDS', oldPasswords)

            await this.prisma.user.update({
                where: { email },
                data: {
                    password: newPassword,
                    // old_password: {
                    //     set: oldPasswords,
                    // },
                },
            })
        } catch (error) {
            console.log(
                '_______________________RESET_PASSWORD_Error_________________',
                error,
            )
            if (error instanceof NotAcceptableException) {
                throw new NotAcceptableException({
                    success: false,
                    message: error.message,
                })
            }
            throw new NotFoundException('User not found')
        }
    }

    async deleteMany(args: Prisma.UserDeleteManyArgs) {
        try {
            await this.prisma.user.deleteMany(args)

            return true
        } catch (error) {
            throw new NotFoundException('Users not found')
        }
    }

    async logoutUser(args: Prisma.UserUpdateArgs) {
        try {
            this.updateUser(args)

            const user = await this.findUser({ where: { id: args.where.id } })

            await this.cacheManager.store.del(
                `${AUTHENTICATION_CACHE_KEY}:${user.id}`,
            )
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }
}
