import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchApplicationByShortNameInput {
    @Field()
    application_short_name: string
}
