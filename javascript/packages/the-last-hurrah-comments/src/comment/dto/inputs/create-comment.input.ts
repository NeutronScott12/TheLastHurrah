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

    @Field({
        deprecationReason:
            'We are moving to application_short_name to represent the application',
    })
    application_id: string

    @Field({ deprecationReason: "We'll be using thread titles instead of ids" })
    thread_id: string
}
