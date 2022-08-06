import { Directive, Field, ObjectType } from '@nestjs/graphql'

// @Directive('@extends')
@ObjectType()
export class StandardResponseModel {
    @Directive('@shareable')
    @Field(() => Boolean)
    success: boolean

    @Directive('@shareable')
    @Field(() => String)
    message: string
}
