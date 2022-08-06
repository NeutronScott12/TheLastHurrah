import { Directive, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
// @Directive('@extends')
export class StandardResponseModel {
    @Directive('@shareable')
    @Field(() => Boolean)
    success: boolean

    @Directive('@shareable')
    @Field(() => String)
    message: string
}
