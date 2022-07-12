import { Directive, Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { OnlineStatus, User, UserRole } from '@prisma/client'

import { AvatarEntity } from './avatar.entity'

registerEnumType(UserRole, {
    name: 'USER_ROLE',
})
registerEnumType(OnlineStatus, {
    name: 'STATUS',
})
@ObjectType()
@Directive('@key(fields: "id")')
export class UserModel {
    @Field((type) => String)
    id: string

    @Field((type) => [String])
    applications_joined_ids: string[]

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field((type) => UserRole)
    user_role: UserRole

    @Field()
    email: string

    @Field(() => [UserModel])
    blocked_users: User[]

    @Field(() => OnlineStatus)
    status: OnlineStatus

    @Field(() => AvatarEntity)
    avatar: AvatarEntity

    @Field(() => Boolean)
    two_factor_authentication: boolean

    @Field()
    username: string

    password: string

    @Field(() => Date)
    last_active: Date

    @Field(() => Boolean)
    confirmed: boolean
}
