import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'

export enum CHOICE {
    ALL,
    BLOCKED,
    REMOVED,
}

registerEnumType(CHOICE, { name: 'CHOICE' })

@InputType()
export class AuthenticatedUserInput {
    @Field(() => CHOICE)
    choice: CHOICE

    @Field(() => Int)
    limit: number

    @Field(() => Int)
    skip: number
}
