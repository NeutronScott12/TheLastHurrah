import { Directive, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Directive('@key(fields: "id")')
export class UserModel {
    @Field((type) => String)
    @Directive('@external')
    id: number
}
