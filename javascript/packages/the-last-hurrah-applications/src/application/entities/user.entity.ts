import { Directive, Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UserModel {
    @Field(() => String)
    @Directive('@external')
    id: string
}
