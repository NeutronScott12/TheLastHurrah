import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { CommentService } from '../services/comment.service'
import { ApplicationModel } from '../models/application.entity'
import { CommentModel } from '../models/comment.model'

@Resolver((of) => ApplicationModel)
export class ApplicationResolver {
    constructor(private readonly commentService: CommentService) {}

    @ResolveField('comments', (of) => [CommentModel])
    public getComments(@Parent() application: ApplicationModel) {
        return this.commentService.findAll({
            where: {
                application_id: application.id,
            },
            include: {
                replies: true,
                up_vote: true,
                down_vote: true,
                _count: true,
            },
        })
    }
}
