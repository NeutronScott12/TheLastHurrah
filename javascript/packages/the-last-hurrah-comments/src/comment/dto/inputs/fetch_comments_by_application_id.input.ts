import { Field, InputType, OmitType } from '@nestjs/graphql'
import { FetchCommentByThreadIdInput } from './fetch_comments_by_thread_id.input'

@InputType()
export class FetchCommentsByApplicationIdInput extends OmitType(
    FetchCommentByThreadIdInput,
    ['thread_id'] as const,
) {
    @Field(() => String)
    application_id: string
}
