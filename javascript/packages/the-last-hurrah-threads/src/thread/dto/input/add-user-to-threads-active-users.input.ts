import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AddUserToActiveUsersInput {
    @Field()
    thread_id: string
}
