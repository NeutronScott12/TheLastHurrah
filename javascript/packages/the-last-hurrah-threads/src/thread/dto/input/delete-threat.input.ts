import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteThreadInput {
    @Field()
    id: string
}
