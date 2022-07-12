import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { User } from '@prisma/client'
import { UserModel } from './user.entity'

@ObjectType()
@Directive('@key(fields: "id")')
export class ProfileEntity {
    @Field()
    id: string

    @Field((type) => UserModel)
    user: UserModel
}
