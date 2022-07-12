import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from '../../entities/user.entity'
import { StandardResponseModel } from './standard-response'

@ObjectType()
export class LoginResponse extends StandardResponseModel {
    @Field(() => Boolean)
    success: boolean

    @Field(() => String)
    token: string

    @Field(() => String)
    refresh_token: string

    @Field(() => UserModel)
    user: UserModel

    @Field((type) => Boolean)
    two_factor_authentication: false
}
