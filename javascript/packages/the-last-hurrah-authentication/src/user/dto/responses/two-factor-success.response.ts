import { Field, ObjectType, OmitType } from '@nestjs/graphql'
import { LoginResponse } from './login-reponse'

@ObjectType()
export class TwoFactorLoginSuccessResponse extends OmitType(LoginResponse, [
    'two_factor_authentication',
] as const) {
    @Field((type) => Boolean)
    two_factor_authentication: true
}
