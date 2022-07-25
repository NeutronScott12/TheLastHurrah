import {
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common'
import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
    ResolveReference,
} from '@nestjs/graphql'
import { v4 as uuidv4 } from 'uuid'
import { Application } from '@prisma/client'

import { ApplicationService } from '../services/application.service'
import { AddModeratorInput } from '../dto/inputs/add-moderator.input'
import { CreateApplicationInput } from '../dto/inputs/create-application.input'
import { RemoveModeratorInput } from '../dto/inputs/remove-moderator.input'
import { UpdateApplicationInput } from '../dto/inputs/update-application.input'
import { ApplicationModel } from '../entities/application.entity'
import { UserModel } from '../entities/user.entity'
import { UpdateApplicationCommentRulesInput } from '../dto/inputs/update_application_comment_rules.input'
import { StandardResponseModel } from '../dto/standard-response'
import { FetchApplicationByShortNameInput } from '../dto/inputs/fetch-application-by-short-name.input'
import {
    CurrentUser,
    ICurrentUser,
} from '@thelasthurrah/the-last-hurrah-shared'
import { RemoveApplicationInput } from '../dto/inputs/remove-application.input'
import { ShadowBanUserByIdInput } from '../dto/inputs/shadow-ban-user-by-id.input'
import { BlockUserFromApplicationInput } from '../dto/inputs/block-user-from-application.input'
import { UnBlockUserFromApplicationInput } from '../dto/inputs/ublock-user-from-application.input'
import { CommenceGrpcService } from '../services/commence.grpc.service'

@Resolver(() => ApplicationModel)
export class ApplicationResolver {
    constructor(
        private readonly applicationService: ApplicationService,
        private readonly commenceService: CommenceGrpcService,
    ) {}

    @ResolveField('application_owner', () => UserModel)
    public getApplicationOwner(@Parent() application: ApplicationModel) {
        return { __typename: 'UserModel', id: application.application_owner_id }
    }

    @ResolveReference()
    async resolveReference(reference: {
        __typename: string
        id: string
    }): Promise<Application> {
        console.log('APPLICATION_RESOLVER_REFERENCE', reference.id)
        return this.applicationService.findOneById({
            where: { id: String(reference.id) },
        })
    }

    @Query(() => ApplicationModel)
    async fetch_application_by_short_name(
        @Args('fetchApplicationByShortNameInput')
        { application_short_name }: FetchApplicationByShortNameInput,
    ) {
        try {
            const application = await this.applicationService.findOneByName({
                where: { short_name: application_short_name },
            })

            return application
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => ApplicationModel)
    async create_application(
        @Args('createApplicationInput')
        createApplicationInput: CreateApplicationInput,
        @CurrentUser() { user_id }: ICurrentUser,
    ) {
        try {
            return this.applicationService.create({
                application_name: createApplicationInput.application_name,
                application_owner_id: user_id,
            })
        } catch (error) {
            console.log('_______________ERROR_______________', error)
            throw new NotAcceptableException({ success: false, message: error })
        }
    }

    @Query(() => [ApplicationModel])
    async fetch_all_applications() {
        const applications = await this.applicationService.findAll({})
        return applications
    }

    @Query(() => [ApplicationModel])
    async fetch_applications_by_owner_id(@CurrentUser() user) {
        return this.applicationService.findAll({
            where: {
                application_owner_id: user.id,
            },
        })
    }

    @Query(() => ApplicationModel)
    find_one_application_by_id(@Args('id') id: string) {
        return this.applicationService.findOneById({
            where: { id: String(id) },
        })
    }

    @Query(() => ApplicationModel)
    find_one_application_by_name(@Args('name') name: string) {
        return this.applicationService.findOneByName({
            where: {
                application_name: name,
            },
        })
    }

    @Mutation(() => ApplicationModel)
    update_application(
        @Args('updateApplicationInput')
        input: UpdateApplicationInput,
    ) {
        return this.applicationService.updateOne({
            where: {
                id: input.id,
            },
            data: {
                ...input,
            },
        })
    }

    @Mutation(() => ApplicationModel)
    async remove_application_moderator(
        @Args('removeModeratorInput')
        { application_id, moderator_id }: RemoveModeratorInput,
    ) {
        try {
            const response = await this.applicationService.findOneById({
                where: { id: application_id },
            })

            const newList = response.moderators_ids.filter(
                (id: string) => id !== moderator_id,
            )

            return this.applicationService.updateOne({
                where: { id: application_id },
                data: {
                    moderators_ids: { set: newList },
                },
            })
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => ApplicationModel)
    async add_application_moderator(
        @Args('addModeratorInput')
        { application_id, moderator_id }: AddModeratorInput,
    ) {
        return this.applicationService.updateOne({
            where: {
                id: application_id,
            },
            data: {
                moderators_ids: { push: moderator_id },
            },
        })
    }

    @Mutation(() => StandardResponseModel)
    async remove_application(
        @Args('removeApplicationInput')
        args: RemoveApplicationInput,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            return this.applicationService.removeApplication(args, user)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => ApplicationModel)
    async regenerate_new_auth_secret(
        @Args('application_id') application_id: string,
    ) {
        return this.applicationService.updateOne({
            where: {
                id: application_id,
            },
            data: {
                auth_secret: uuidv4(),
            },
        })
    }

    @Mutation(() => ApplicationModel)
    async update_application_comment_rules(
        @Args('updateApplicationCommentRulesInput')
        {
            application_short_name,
            allow_images_and_videos_on_comments,
            display_comments_when_flagged,
            email_mods_when_comments_flagged,
            links_in_comments,
            pre_comment_moderation,
        }: UpdateApplicationCommentRulesInput,
    ) {
        try {
            return this.applicationService.updateOne({
                where: { short_name: application_short_name },
                data: {
                    allow_images_and_videos_on_comments,
                    display_comments_when_flagged,
                    email_mods_when_comments_flagged,
                    links_in_comments,
                    pre_comment_moderation,
                },
            })
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async add_user_to_shadow_ban(
        @Args('addUserToShadowBan')
        args: ShadowBanUserByIdInput,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            return this.applicationService.addToShadowBan(args, user)
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async remove_users_from_shadow_ban(
        @Args('removeUserToShadowBan')
        args: ShadowBanUserByIdInput,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            return this.applicationService.removeFromShadowBan(args, user)
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => ApplicationModel)
    async block_users_from_application(
        @Args('blockUsersFromApplication') args: BlockUserFromApplicationInput,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            return this.applicationService.blockUsers(args, user)
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => ApplicationModel)
    async unblock_users_from_application(
        @Args('unBlockUsersFromApplication')
        args: UnBlockUserFromApplicationInput,
        @CurrentUser() user: ICurrentUser,
    ) {
        try {
            return this.applicationService.unBlockUsers(args, user)
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponseModel)
    async upgrade_subscription_plan(@CurrentUser() { user_id }: ICurrentUser) {
        try {
            const result = await this.commenceService.createSubscription({
                customer_id: user_id,
                location_id: '',
                plan_id: '',
            })

            return result
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }
}
