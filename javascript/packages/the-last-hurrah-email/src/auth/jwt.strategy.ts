import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthenticationError } from 'apollo-server-express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { USER_NOT_VERIFIED } from 'src/constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload: any) {
        if (payload.confirmed) {
            return { id: payload.id, email: payload.email }
        } else {
            throw new AuthenticationError(USER_NOT_VERIFIED)
        }
    }
}
