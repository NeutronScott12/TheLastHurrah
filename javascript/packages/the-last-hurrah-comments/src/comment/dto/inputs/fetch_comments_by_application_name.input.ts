import { Field, InputType, OmitType, registerEnumType } from '@nestjs/graphql'
import { FetchCommentsByApplicationIdInput } from './fetch_comments_by_application_id.input'

export enum WHERE_COMMMENTS {
    PENDING = 'pending',
    APPOVED = 'approved',
    SPAM = 'spam',
    DELETED = 'deleted',
    ALL = 'all',
}

registerEnumType(WHERE_COMMMENTS, {
    name: 'where',
})
@InputType()
export class FetchCommentsByApplicationShortNameInput extends OmitType(
    FetchCommentsByApplicationIdInput,
    ['application_id'] as const,
) {
    @Field(() => String)
    application_short_name: string

    @Field(() => WHERE_COMMMENTS)
    where: WHERE_COMMMENTS
}
