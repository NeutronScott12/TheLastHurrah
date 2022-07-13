import {
    CACHE_MANAGER,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import * as jwt from 'jsonwebtoken'

import { AUTHENTICATION_CACHE_KEY, USER_NOT_VERIFIED } from '../constants'
import { ApplicationService } from 'src/application/services/application.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        configService: ConfigService,
        private readonly applicationService: ApplicationService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: async (request, token, done) => {
                const decodeToken = jwt.decode(token) as {
                    application_id: string
                    user_id: string
                }

                if (decodeToken && decodeToken.application_id) {
                    const result =
                        await this.applicationService.check_valid_user({
                            application_id: decodeToken.application_id,
                            user_id: decodeToken.user_id,
                        })

                    if (result.success) {
                        done(null, result.auth_secret)
                    }
                } else {
                    done(null, configService.get('JWT_SECRET'))
                }
            },
        })
    }

    async validate(payload: any) {
        try {
            const result = await this.cacheManager.get<{
                user: {
                    confirmed: boolean
                    id: string
                    email: string
                }
            }>(`${AUTHENTICATION_CACHE_KEY}:${payload.user_id}`)

            if (result.user.confirmed) {
                return { user_id: result.user.id, email: result.user.email }
            } else {
                throw new ForbiddenException({
                    success: false,
                    details: USER_NOT_VERIFIED,
                })
            }
        } catch (error) {
            throw new ForbiddenException({
                success: false,
                details: error.details,
            })
        }
    }
}
