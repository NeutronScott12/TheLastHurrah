import { Field, ObjectType } from '@nestjs/graphql'
import { StandardResponseModel } from './standard-response'

@ObjectType()
export class TwoFactorLoginResponse extends StandardResponseModel {
    @Field((type) => Boolean)
    two_factor_authentication: true
}
