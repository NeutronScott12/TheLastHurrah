import {
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common'
import {
    Args,
    Context,
    Mutation,
    Query,
    Resolver,
    ResolveReference,
} from '@nestjs/graphql'
import {
    CurrentUser,
    EmailSchema,
    GqlAuthGuard,
    ICurrentUser,
    RegisterSchema,
    sendConfirmationEmail,
    verifyToken,
} from '@thelasthurrah/the-last-hurrah-shared'

import { LoginResponseUnion } from '../dto/unions/login-response.union'
import {
    JWT_SECRET,
    MAIN_SERVER,
    NON_ACCOUNT_EMAIL,
    PASSWORD_SUCCESSFULLY_CHANGED,
    USER_DOES_NOT_EXIST,
    USER_HAS_BEEN_CONFIRMED,
} from '../../constants'
import { ChangePasswordInput } from '../dto/inputs/change-password.input'
import { ForgotPasswordInput } from '../dto/inputs/fogot-password.input'
import { LoginInput } from '../dto/inputs/login.input'
import { RegistrationInput } from '../dto/inputs/registration.input'
import { StandardResponseModel } from '../dto/responses/standard-response'
import { UserModel } from '../entities/user.entity'
import { AuthEmailProducer } from '../producers/auth-email.producer'
import { UserService } from '../services/user.service'
import { TwoFactorInput } from '../dto/inputs/two-factor.input'
import { UpdateUserInput } from '../dto/inputs/update-user.input'
import { TwoFactorLoginSuccessResponse } from '../dto/responses/two-factor-success.response'
import { ResendEmailCodeInput } from '../dto/inputs/resend-email-code.input'
import { IContext } from '../../types'
import { DeleteUserInput } from '../dto/inputs/delete-user.input'

@Resolver((of) => UserModel)
export class UserResolver {
    constructor(
        private userService: UserService,
        private authEmailProducer: AuthEmailProducer,
    ) {}

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }) {
        return this.userService.findUniqueUser({
            where: {
                id: reference.id,
            },
            include: { avatar: true, blocked_users: true },
        })
    }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => UserModel)
    async search_user_by_email(@Args('email') email: string) {
        try {
            return this.userService.findUser({
                where: {
                    email,
                },
            })
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => [UserModel])
    async fetch_users() {
        const users = await this.userService.findUsers({
            include: { blocked_users: true, avatar: true },
        })

        return users
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => UserModel)
    async current_user(@CurrentUser() current_user: ICurrentUser) {
        const response = await this.userService.findUniqueUser({
            where: {
                id: current_user.user_id,
            },
        })

        return response
    }

    @Mutation(() => StandardResponseModel)
    async register_user(
        @Args('registrationInput')
        {
            username,
            email,
            password,
            application_id,
            two_factor_authentication,
            application_short_name,
        }: RegistrationInput,
        @Context() ctx?: IContext,
    ) {
        try {
            await RegisterSchema.validate({
                username,
                email,
                password,
            })

            // console.log('HEADERS', ctx.req.headers)

            let user_ip = ctx.req.headers['x-real-ip'] as string

            // console.log('USER_IP', user_ip)

            await this.userService.register(
                {
                    data: {
                        email,
                        password,
                        username,
                        two_factor_authentication,
                        user_ip,
                    },
                },
                application_id,
                application_short_name,
            )

            return {
                success: true,
                message: `Confirmation email has been sent to ${email}`,
            }
        } catch (error) {
            throw new BadRequestException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => LoginResponseUnion)
    async login_user(
        @Args('loginInput')
        {
            email: emailArgs,
            password: passwordArg,
            application_short_name,
        }: LoginInput,
    ): Promise<typeof LoginResponseUnion> {
        try {
            const result = await this.userService.login(
                {
                    email: emailArgs,
                    password: passwordArg,
                },
                application_short_name,
            )

            return result
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => TwoFactorLoginSuccessResponse)
    async two_factor_login(
        @Args('twoFactorInput') { email, two_factor_id }: TwoFactorInput,
    ) {
        try {
            return this.userService.two_factor_login({ email }, two_factor_id)
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: USER_DOES_NOT_EXIST,
            })
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => StandardResponseModel)
    async logout_user(@CurrentUser() { user_id }: ICurrentUser) {
        try {
            await this.userService.logoutUser({
                where: { id: user_id },
                data: {
                    status: 'OFFLINE',
                    last_active: new Date(),
                },
            })

            return {
                success: true,
                message: 'User successfully logged out',
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: USER_DOES_NOT_EXIST,
            })
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => StandardResponseModel)
    async block_user(
        @Args('user_id') user_id: string,
        @CurrentUser() { user_id: id }: ICurrentUser,
    ) {
        try {
            if (id === user_id) {
                throw new ForbiddenException({
                    success: false,
                    message: 'Can not block yourself, idiot',
                })
            }
            const blocked_user = await this.userService.findUniqueUser({
                where: {
                    id: user_id,
                },
            })
            await this.userService.updateUser({
                where: { id },
                data: {
                    blocked_users: {
                        connect: { id: blocked_user.id },
                    },
                },
            })

            return {
                success: true,
                message: `User successfully blocked`,
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: USER_DOES_NOT_EXIST,
            })
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => StandardResponseModel)
    async unblock_user(
        @Args('user_id') user_id: string,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            const unblock_user = await this.userService.findUniqueUser({
                where: {
                    id: user_id,
                },
            })
            await this.userService.updateUser({
                where: { id: user.user_id },
                data: {
                    blocked_users: { disconnect: { id: unblock_user.id } },
                },
                include: {
                    blocked_users: true,
                },
            })

            return {
                success: true,
                message: `User successfully unblocked`,
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: USER_DOES_NOT_EXIST,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async forgot_password(
        @Args('forgotPasswordInput')
        { email: emailArgs, redirect_url }: ForgotPasswordInput,
    ) {
        try {
            const { id, email, username } =
                await this.userService.forgotPassword(emailArgs)

            if (id) {
                await this.authEmailProducer.sendChangePasswordEmailQueue({
                    email,
                    username,
                    id,
                })

                return {
                    success: true,
                    message: `Reset email has been sent to ${email}`,
                }
            } else {
                return {
                    success: false,
                    message: NON_ACCOUNT_EMAIL,
                }
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Mutation(() => StandardResponseModel)
    async change_password(
        @Args('changePasswordInput') { email, password }: ChangePasswordInput,
    ) {
        try {
            // console.log('EMAIL', email)
            // console.log('PASSWORD', password)
            await EmailSchema.validate({
                email,
            })

            if (password) {
                await this.userService.resetPassword(password, email)

                return {
                    success: true,
                    message: PASSWORD_SUCCESSFULLY_CHANGED,
                }
            } else {
                return {
                    success: false,
                    message: 'Invalid Password',
                }
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    @Mutation(() => StandardResponseModel)
    async confirm_user(@Args('token') token: string) {
        try {
            let valid: any

            valid = verifyToken(token, JWT_SECRET)

            if (valid) {
                await this.userService.updateUser({
                    where: {
                        id: valid.id,
                    },
                    data: {
                        confirmed: true,
                    },
                })
            }

            return {
                success: true,
                message: USER_HAS_BEEN_CONFIRMED,
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    @Query(() => StandardResponseModel)
    async resend_email_code(
        @Args('resendEmailCodeInput')
        { email: emailArgs, redirect_url }: ResendEmailCodeInput,
    ) {
        try {
            const { email, id, username } = await this.userService.findUser({
                where: { email: emailArgs },
            })

            const url = redirect_url
                ? redirect_url
                : MAIN_SERVER + 'user/change_password'

            if (email) {
                sendConfirmationEmail(
                    { id: String(id), username, email },
                    url,
                    JWT_SECRET,
                    'scottberry91@gmail.com',
                )

                return {
                    success: true,
                    message: 'New confirmation link has been sent',
                }
            } else {
                throw new NotFoundException("That email doesn't exist")
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserModel)
    async update_user(
        @Args('updateUserInput') args: UpdateUserInput,
        @CurrentUser() { user_id: id }: ICurrentUser,
    ) {
        try {
            return this.userService.updateUser({
                where: { id },
                data: { ...args },
            })
        } catch (error) {
            return new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => StandardResponseModel)
    async delete_user(@Args('deleteUserInput') { email }: DeleteUserInput) {
        try {
            await this.userService.delete({ where: { email } })

            return {
                success: true,
                message: `Account with ${email} has been deleted`,
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }
}
