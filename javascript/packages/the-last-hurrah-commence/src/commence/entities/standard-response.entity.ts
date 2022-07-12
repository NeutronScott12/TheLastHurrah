import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
// @Directive('@extends')
export class StandardResponseModel {
    @Field(() => Boolean)
    success: boolean

    @Field(() => String)
    message: string
}
