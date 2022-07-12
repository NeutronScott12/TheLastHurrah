import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StandardResponse {
    @Field(() => Boolean)
    success: boolean

    @Field()
    message: string
}
