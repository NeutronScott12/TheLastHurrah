import { Field, ObjectType } from '@nestjs/graphql'
import { VoteEntity } from './vote.entity'

@ObjectType()
export class OptionEntity {
    @Field()
    id: string

    @Field()
    option: string

    @Field(() => [VoteEntity])
    votes: VoteEntity[]
}
