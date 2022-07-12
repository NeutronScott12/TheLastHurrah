import { ObjectType } from '@nestjs/graphql'
import { FetchCommentByThreadIdResponse } from './fetch_comments_by_thread_id.response'

@ObjectType()
export class FetchCommentByApplicationName extends FetchCommentByThreadIdResponse {}
