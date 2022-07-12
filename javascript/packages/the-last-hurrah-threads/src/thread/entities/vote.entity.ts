// model Vote {
//     id       String  @id @default(uuid())
//     user_id  String
//     Option   Option? @relation(fields: [optionId], references: [id])
//     optionId String?
//   }

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VoteEntity {
    @Field()
    id: string

    @Field()
    user_id: string

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date
}
