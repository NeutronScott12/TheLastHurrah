import { PrismaClient } from '@prisma/client'
import { ThreadGrpcService } from 'src/application/services/thread-grpc.service'

const checkIfModerator = (user_id: string, moderators: string[]): boolean =>
    moderators.some((id) => id === user_id)

const checkIfOwner = (user_id: string, owner_id: string): boolean =>
    user_id === owner_id

export const checkIfOwnerOrModerator = (
    user_id: string,
    owner_id: string,
    moderators: string[],
): boolean => {
    return (
        checkIfModerator(user_id, moderators) || checkIfOwner(user_id, owner_id)
    )
}

export const checkPermissions = async (
    prisma: PrismaClient,
    threadGrpcService: ThreadGrpcService,
    user_id: string,
    thread_id: string,
): Promise<boolean> => {
    const thread = await threadGrpcService.fetchThreadById({ id: thread_id })

    const application = await prisma.application.findUnique({
        where: { id: thread.application_id },
        select: { application_owner_id: true, moderators_ids: true },
    })

    return checkIfOwnerOrModerator(
        user_id,
        application.application_owner_id,
        application.moderators_ids,
    )
}
