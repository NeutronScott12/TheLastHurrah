import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StandardResponseModel {
    @Field(() => Boolean)
    success: boolean

    @Field()
    message: string
}
