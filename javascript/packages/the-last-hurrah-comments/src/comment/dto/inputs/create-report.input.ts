import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { REPORT_REASON } from '@prisma/client'

registerEnumType(REPORT_REASON, {
    name: 'REPORT_REASON',
})
@InputType()
export class CreateReportInput {
    @Field()
    comment_id: string

    @Field(() => REPORT_REASON)
    report: REPORT_REASON
}
