import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RemoveApplicationInput {
    @Field()
    application_id: string
}
