// model Poll {
//     id         String   @id @default(uuid())
//     created_at DateTime @default(now())
//     updated_at DateTime @updatedAt
//     options    Option[]
//     Thread     Thread[]
//   }

import { Option } from '.prisma/client'
import { Field, ObjectType } from '@nestjs/graphql'
import { OptionEntity } from './option.entity'

@ObjectType()
export class PollEntity {
    @Field()
    id: string

    @Field()
    title: string

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field((type) => [String])
    voted: string[]

    @Field((type) => Boolean)
    closed: boolean

    @Field((type) => [OptionEntity])
    options: Option[]
}
