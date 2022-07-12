import { Field, InputType } from '@nestjs/graphql'
import { MaxLength } from '@nestjs/class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

@InputType()
export class UpdateCommentInput {
    @Field()
    @MaxLength(1000)
    plain_text_body: string

    @Field((type) => GraphQLJSONObject)
    json_body: object

    @Field()
    comment_id: string
}
