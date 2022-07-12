import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePollInput {
    @Field()
    poll_id: string

    @Field()
    thread_id: string
}
