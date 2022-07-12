import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RemoveUserFromThreadsActiveUsersInput {
    @Field()
    thread_id: string
}
