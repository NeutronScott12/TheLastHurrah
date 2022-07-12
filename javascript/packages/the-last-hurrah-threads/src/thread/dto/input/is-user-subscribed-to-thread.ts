import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class IsUserSubscribedToThreadInput {
    @Field()
    thread_id: string
}
