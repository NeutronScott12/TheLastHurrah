import { UserRole } from '.prisma/client'
import { Field, InputType, OmitType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
    @Field((type) => Boolean, { nullable: true })
    two_factor_authentication: boolean

    @Field(() => UserRole, { nullable: true })
    user_role: UserRole

    @Field(() => String, { nullable: true })
    email: string

    @Field(() => String, { nullable: true })
    username: string
}
