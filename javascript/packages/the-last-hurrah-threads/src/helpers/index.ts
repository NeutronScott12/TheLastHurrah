import { PrismaClient } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { ApplicationGrpcService } from 'src/thread/services/application-grpc.service'

const checkIfModerator = (user_id: string, moderators: string[]): boolean =>
    moderators.some((id) => id === user_id)

const checkIfOwner = (user_id: string, owner_id: string): boolean =>
    user_id === owner_id

const checkIfOwnerOrModerator = (
    user_id: string,
    owner_id: string,
    moderators: string[],
): boolean => {
    return (
        checkIfModerator(user_id, moderators) || checkIfOwner(user_id, owner_id)
    )
}

export const checkPermissions = async (
    prisma: PrismaService,
    applicationService: ApplicationGrpcService,
    user_id: string,
    thread_id: string,
): Promise<boolean> => {
    const thread = await prisma.thread.findFirst({
        where: { id: thread_id },
        select: { application_id: true },
    })

    const application = await applicationService.findApplicationById({
        id: thread.application_id,
    })

    return checkIfOwnerOrModerator(
        user_id,
        application.application_owner_id,
        application.moderators_ids,
    )
}
