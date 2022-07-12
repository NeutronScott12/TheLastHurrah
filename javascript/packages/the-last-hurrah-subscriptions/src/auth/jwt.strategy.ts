import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { JWT_SECRET, USER_NOT_VERIFIED } from 'src/constants'
import { AuthenticationError } from 'apollo-server-errors'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
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
