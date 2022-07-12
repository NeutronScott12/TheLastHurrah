import { Field, ObjectType } from '@nestjs/graphql'
import { REPORT_REASON } from '@prisma/client'

// model Report {
//     id         String        @id @default(uuid())
//     user_id    String
//     reason     REPORT_REASON
//     created_at DateTime      @default(now())
//     updated_at DateTime      @updatedAt
//     Comment    Comment?      @relation(fields: [commentId], references: [id])
//     commentId  String?
//   }

@ObjectType()
export class ReportModel {
    @Field()
    id: string

    @Field()
    user_id: string

    @Field(() => REPORT_REASON)
    reason: REPORT_REASON

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date
}
