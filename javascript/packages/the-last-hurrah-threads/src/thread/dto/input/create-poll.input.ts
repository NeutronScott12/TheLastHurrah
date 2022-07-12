import { Field, InputType } from '@nestjs/graphql'
import { Option } from '@prisma/client'

@InputType()
class OptionInput {
    @Field()
    option: string
}

@InputType()
export class CreatePollInput {
    @Field()
    thread_id: string

    @Field()
    title: string

    @Field(() => [OptionInput])
    options: OptionInput[]
}
