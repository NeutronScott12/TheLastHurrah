import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FindAllCommentInput {
    @Field((type) => String, {
        deprecationReason:
            "We'll be using application_short_name to represent the application",
    })
    application_id: string
}
