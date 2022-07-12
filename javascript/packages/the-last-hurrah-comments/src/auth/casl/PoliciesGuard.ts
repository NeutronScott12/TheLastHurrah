import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
} from '@nestjs/common'
// import { Reflector } from '@nestjs/core'
// import { GqlExecutionContext } from '@nestjs/graphql'
// import { INVALID_CREDENTIALS } from 'src/constants'
// import { AppAbility, CaslAbilityFactory } from './casl.ability.factory'

// export const CHECK_POLICIES_KEY = 'check_policy'
// export const CheckPolicies = (...handlers: PolicyHandler[]) =>
//     SetMetadata(CHECK_POLICIES_KEY, handlers)

// interface IPolicyHandler {
//     handle(ability: AppAbility): boolean
// }

// type PolicyHandlerCallback = (ability: AppAbility) => boolean

// export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        //     private reflector: Reflector,
        // private caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext) {
        // Promise<boolean> {
        //         const policyHandlers =
        //             this.reflector.get<PolicyHandler[]>(
        //                 CHECK_POLICIES_KEY,
        //                 context.getHandler(),
        //             ) || []

        //         const ctx = GqlExecutionContext.create(context)

        //         const user = ctx.getContext().req.user

        //         if (!user) {
        //             throw new UnauthorizedException({
        //                 success: false,
        //                 message: INVALID_CREDENTIALS,
        //             })
        //         }

        //         const ability = await this.caslAbilityFactory.createForUser(user)

        //         return policyHandlers.every((handler) =>
        //             this.execPolicyHandler(handler, ability),
        //         )
        return true
    }

    //     private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    //         if (typeof handler === 'function') {
    //             return handler(ability)
    //         }

    //         return handler.handle(ability)
    //     }
}
