import { createUnionType } from '@nestjs/graphql'
import { LoginResponse } from '../responses/login-reponse'
import { TwoFactorLoginResponse } from '../responses/two-factor-login.response'

export const LoginResponseUnion = createUnionType({
    name: 'LoginResponseUnion',
    types: () => [LoginResponse, TwoFactorLoginResponse],
    resolveType(value) {
        if (value.two_factor_authentication) {
            return TwoFactorLoginResponse
        }
        if (value.token) {
            return LoginResponse
        }
        return null
    },
})
