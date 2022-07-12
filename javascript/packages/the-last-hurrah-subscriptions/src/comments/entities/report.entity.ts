import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum REPORT_REASON {
    DISAGREE = 'DISAGREE',
    SPAM = 'SPAM',
    INAPPROPRIATE_PROFILE = 'INAPPROPRIATE_PROFILE',
    THREATENING_CONTENT = 'THREATENING_CONTENT',
    PRIVATE_INFORMATION = 'PRIVATE_INFORMATION',
}

registerEnumType(REPORT_REASON, { name: 'REPORT_REASON' })

@ObjectType()
export class ReportEntity {
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
