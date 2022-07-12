import {
    CACHE_MANAGER,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Cache } from 'cache-manager'

import { USER_NOT_VERIFIED } from '../constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
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
            }>(payload.id)

            if (result.user.confirmed) {
                return { id: result.user.id, email: result.user.email }
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
