import { Field, InputType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { MaxLength } from '@nestjs/class-validator'

@InputType()
export class CreateCommentInput {
    @Field()
    @MaxLength(1000)
    plain_text_body: string

    @Field((type) => [GraphQLJSONObject])
    json_body: object

    @Field()
    application_id: string

    @Field()
    thread_id: string
}
