import { Directive, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StandardResponseModel {
    @Directive('@shareable')
    @Field(() => Boolean)
    success: boolean

    @Directive('@shareable')
    @Field()
    message: string
}
