import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class FindOrCreateOneThreadInput {
    @Field(() => String, { description: 'Thread Title', nullable: true })
    title: string

    @Field(() => String, { description: 'Thread website url' })
    website_url: string

    @Field(() => String, { description: 'Application ID' })
    application_id: string
}
