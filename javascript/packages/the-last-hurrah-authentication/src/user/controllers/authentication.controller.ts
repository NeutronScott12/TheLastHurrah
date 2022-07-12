import {
    BadRequestException,
    Body,
    CACHE_MANAGER,
    Controller,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Req,
} from '@nestjs/common'
import {
    EmailSchema,
    RegisterSchema,
} from '@thelasthurrah/the-last-hurrah-shared'
import { Cache } from 'cache-manager'

import {
    NON_ACCOUNT_EMAIL,
    PASSWORD_SUCCESSFULLY_CHANGED,
    USER_DOES_NOT_EXIST,
} from '../../constants'
import { ChangePasswordInput } from '../dto/inputs/change-password.input'
import { ForgotPasswordInput } from '../dto/inputs/fogot-password.input'
import { LoginInput } from '../dto/inputs/login.input'
import { RegistrationInput } from '../dto/inputs/registration.input'
import { TwoFactorInput } from '../dto/inputs/two-factor.input'
import { LoginResponseUnion } from '../dto/unions/login-response.union'
import { AuthEmailProducer } from '../producers/auth-email.producer'
import { UserService } from '../services/user.service'

@Controller('api/auth')
export class AuthenticationController {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private userService: UserService,
        private readonly authEmailProducer: AuthEmailProducer,
    ) {}

    @Post('/2fa')
    async two_factor_login(@Body() { email, two_factor_id }: TwoFactorInput) {
        try {
            return this.userService.two_factor_login({ email }, two_factor_id)
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: USER_DOES_NOT_EXIST,
            })
        }
    }

    @Post('/login')
    async login(
        @Body()
        {
            email: emailArgs,
            password: passwordArgs,
            application_short_name,
        }: LoginInput,
    ): Promise<typeof LoginResponseUnion> {
        try {
            const response = await this.userService.login(
                {
                    email: emailArgs,
                    password: passwordArgs,
                },
                application_short_name,
            )

            return response
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Post('/register')
    async register(
        @Body()
        {
            username,
            email,
            password,
            application_id,
            two_factor_authentication,
            application_short_name,
        }: RegistrationInput,
        @Req() req,
    ) {
        try {
            await RegisterSchema.validate({
                username,
                email,
                password,
            })

            // console.log('HEADERS', ctx.req.headers)

            let user_ip = req.headers['x-real-ip'] as string

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

    @Post('/forgot-password')
    async forgot_password(@Body() { email: emailArgs }: ForgotPasswordInput) {
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

    @Post('/change-password')
    async change_password(@Body() { email, password }: ChangePasswordInput) {
        try {
            console.log('EMAIL', email)
            console.log('PASSWORD', password)
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
}
