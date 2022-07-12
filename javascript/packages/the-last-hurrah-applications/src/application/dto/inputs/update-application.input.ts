import { InputType, Field } from '@nestjs/graphql'
import { BaseApplicationInput } from '../base-application-input'

@InputType()
export class UpdateApplicationInput extends BaseApplicationInput {
    @Field()
    id: string
}
