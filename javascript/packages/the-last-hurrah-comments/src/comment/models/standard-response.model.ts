import { Field, ObjectType } from '@nestjs/graphql'

// @Directive('@extends')
@ObjectType()
export class StandardResponseModel {
    @Field(() => Boolean)
    success: boolean

    @Field(() => String)
    message: string
}
