import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FindThreadByIdInput {
    @Field()
    thread_id: string
}
