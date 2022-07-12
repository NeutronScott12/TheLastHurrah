import { Field, InputType } from '@nestjs/graphql'
import { BaseApplicationInput } from '../base-application-input'

@InputType()
export class CreateApplicationInput extends BaseApplicationInput {
    @Field()
    application_name: string
}
