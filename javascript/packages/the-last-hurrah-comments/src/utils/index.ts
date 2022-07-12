import { PrismaService } from 'src/prisma/prisma.service'
import { CommentsArgsIncludes } from './validation/config'

type UpVoteOrDownVote = 'up_vote' | 'down_vote'

// export const check_ratings = async (
//     prisma: PrismaService,
//     comment_id: string,
//     user_id: string,
//     vote: UpVoteOrDownVote,
// ) => {
//     const up_votes_comments = await prisma.comment
//         .findUnique({ where: { id: comment_id } })
//         .up_vote()

//     const matches_upvote = up_votes_comments.some(
//         (vote) => vote.author_id === user_id,
//     )

//     if (matches_upvote) {
//         return prisma.comment.findUnique({
//             where: { id: comment_id },
//             include: CommentsArgsIncludes,
//         })
//     }

//     const down_votes_comments = await prisma.comment
//         .findUnique({
//             where: {
//                 id: comment_id,
//             },
//         })
//         .down_vote()

//     const matches_downvote = down_votes_comments.some(
//         (vote) => vote.author_id === user_id,
//     )

//     if (matches_downvote) {
//         const rating = down_votes_comments.find(
//             (vote) => vote.author_id === user_id,
//         )
//         await prisma.comment.update({
//             where: { id: comment_id },
//             data: {
//                 down_vote: {
//                     delete: {
//                         id: rating.id,
//                     },
//                 },
//             },
//         })
//     }

//     return prisma.upVoteRating.create({
//         data: {
//             author_id: user_id,
//         },
//     })
// }
