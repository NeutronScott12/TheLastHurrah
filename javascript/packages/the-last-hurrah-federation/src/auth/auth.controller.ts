import {
    Body,
    Controller,
    Get,
    NotAcceptableException,
    NotFoundException,
    Post,
    Render,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common'
import {
    hashPassword,
    repeatPasswordSchema,
    verifyToken,
} from '@thelasthurrah/the-last-hurrah-shared'

import { TOKEN_SECRET } from '../contants'

import { AuthService } from './auth.service'

@Controller('user')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('password_changed')
    @Render('password_changed')
    password_changed() {}

    @Post('change_password')
    async change_password(@Body() payload) {
        try {
            await repeatPasswordSchema.validate({
                password: payload.password,
                repeatPassword: payload.repeatPassword,
            })

            if (payload.password == payload.repeatPassword) {
                try {
                    await this.authService.updateByEmail({
                        where: {
                            email: payload.email,
                        },
                        data: {
                            password: await hashPassword(payload.password),
                        },
                    })

                    return { success: true, message: 'password changed' }
                } catch (error) {
                    throw new NotFoundException({
                        success: false,
                        message: error.message,
                    })
                }
            } else {
                throw new NotAcceptableException({
                    success: false,
                    message: 'Passwords did not match',
                })
            }
        } catch (error) {
            throw new UnauthorizedException({
                success: false,
                error: error.message,
            })
        }
    }

    @Get('reset_password')
    @Render('reset_password')
    async reset_password(@Req() req, @Res() res) {
        const token = req.query.t

        let valid
        try {
            try {
                valid = verifyToken(token, TOKEN_SECRET)
            } catch (error) {
                res.render('invalid_token')
            }

            return {
                message: 'working',
                email: valid.email,
                server_url:
                    req.protocol +
                    '://' +
                    req.get('host') +
                    '/user/change_password',
            }
        } catch (error) {
            return res.render('invalid_token', { message: error.message })
        }
    }

    @Render('confirmation')
    @Get('confirmation')
    async confirmation(@Req() req, @Res() res) {
        try {
            const token = req.query.t

            if (!token) {
                res.redirect('invalid_token')
            }

            let valid
            try {
                valid = verifyToken(token, TOKEN_SECRET)
            } catch (error) {
                return res.redirect('invalid_token')
            }

            if (valid) {
                try {
                    await this.authService.updateByEmail({
                        where: {
                            email: valid.email,
                        },
                        data: {
                            confirmed: true,
                        },
                    })

                    return { message: 'You have confirmed your account' }
                } catch (error) {
                    throw new NotFoundException({
                        success: false,
                        message: error.message,
                    })
                }
            } else {
                return res.send('<h1>Something went wrong</h1>')
            }
        } catch (error) {
            return error
        }
    }
}
