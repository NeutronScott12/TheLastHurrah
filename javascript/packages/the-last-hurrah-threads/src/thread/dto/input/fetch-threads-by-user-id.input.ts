import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchThreadsByUserIdInput {
    @Field()
    user_id: string
}
