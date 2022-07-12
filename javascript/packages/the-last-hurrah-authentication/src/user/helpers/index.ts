import { ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { APPLICATION_DOES_NOT_EXIST } from 'src/constants'
import { CHOICE } from '../dto/inputs/authenticated-users.input'
import { ICheckValidUserResponse } from '../proto/application/application_grpc_types'
import { ApplicationService } from '../services/application.service'

interface IGenerateUserWhere {
    choice: CHOICE
    authenticated_users_ids: string[]
    banned_users_by_id: string[]
}

export const generateUserWhere = ({
    choice,
    authenticated_users_ids,
    banned_users_by_id,
}: IGenerateUserWhere): Prisma.UserWhereInput => {
    const all = authenticated_users_ids.concat(banned_users_by_id)

    switch (choice) {
        case CHOICE.ALL:
            return { id: { in: all } }
        case CHOICE.BLOCKED:
            return {
                id: { in: banned_users_by_id },
            }
        case CHOICE.REMOVED:
            return {
                id: { in: all },
            }
        default:
            return { id: { in: all } }
    }
}

export const checkApplicationExists = async (
    application_short_name: string,
    applicationService: ApplicationService,
    user_id: string,
): Promise<ICheckValidUserResponse> => {
    let check_application: ICheckValidUserResponse

    if (application_short_name) {
        check_application = await applicationService.checkValidUser({
            application_short_name,
            user_id,
        })
    }

    //@TODO check if user is valid
    if (application_short_name && check_application?.success === false) {
        throw new ForbiddenException(APPLICATION_DOES_NOT_EXIST)
    }

    return check_application
}
