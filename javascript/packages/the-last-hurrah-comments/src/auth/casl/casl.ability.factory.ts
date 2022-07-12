// import { AbilityBuilder, AbilityClass } from '@casl/ability'
// import { Subjects, PrismaAbility } from '@casl/prisma'
// import { Comment, DownVoteRating, Report, UpVoteRating } from '@prisma/client'
// import { Injectable, UnauthorizedException } from '@nestjs/common'
// import { ApplicationService } from 'src/comment/services/application.service'
// import { lastValueFrom } from 'rxjs'
// import { CommentService } from 'src/comment/services/comment.service'
// import { INVALID_CREDENTIALS } from 'src/constants'

// export enum Action {
//     Manage = 'manage',
//     Create = 'create',
//     Read = 'read',
//     Update = 'update',
//     Delete = 'delete',
// }

// type PrismaSubjects = Subjects<{
//     Comment: Comment
//     UpVoteRating: UpVoteRating
//     DownVoteRating: DownVoteRating
//     Report: Report
// }>

// export type AppAbility = PrismaAbility<[Action, PrismaSubjects]>

// const AppAbility = PrismaAbility as AbilityClass<AppAbility>

// @Injectable()
// export class CaslAbilityFactory {
//     constructor(
//         private applicationService: ApplicationService,
//         private commentService: CommentService,
//     ) {}

//     async createForUser(user: { id: string }) {
//         const { can, cannot, build } = new AbilityBuilder<AppAbility>(
//             AppAbility,
//         )

//         can(Action.Manage, 'Comment', { user_id: { equals: user.id } })
//         can(Action.Read, 'Comment')

//         return build()
//         // return build({
//         //     detectSubjectType: (item) =>
//         //         item.constructor as ExtractSubjectType<PrismaSubjects>,
//         // })
//     }

//     async createForAccessPermission(
//         user_id: string,
//         application_id: string,
//         comment_id: string,
//     ) {
//         const { can, cannot, build } = new AbilityBuilder<AppAbility>(
//             AppAbility,
//         )

//         const response = await this.applicationService.getApplicationById(
//             application_id,
//         )

//         const comment = await this.commentService.findOneById({
//             where: { id: comment_id },
//         })

//         if (response.moderators_ids.find((id) => id === user_id)) {
//             can(Action.Manage, 'Comment')
//         } else if (comment.user_id === user_id) {
//             can(Action.Manage, 'Comment', { user_id: { equals: user_id } })
//         } else {
//             throw new UnauthorizedException({
//                 success: false,
//                 message: INVALID_CREDENTIALS,
//             })
//         }

//         return build()
//     }
// }
