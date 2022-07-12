import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class FindMembersInput {
    @Field((type) => String)
    application_id: string
}
