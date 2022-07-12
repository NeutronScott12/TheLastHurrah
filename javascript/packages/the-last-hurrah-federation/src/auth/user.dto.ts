import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'
// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
// } from 'typeorm'

export enum Roles {
    USER,
    MODERATOR,
    ADMIN,
    OWNER,
}
@ObjectType()
// @Directive('@extends')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UserDto {
    @Field((type) => ID)
    @Directive('@external')
    // @Directive('@external')
    id: number

    @Field((type) => Date)
    createdAt: Date

    @Field((type) => Date)
    updatedAt: Date

    @Field()
    userRole: string

    @Field()
    email: string

    @Field()
    username: string

    password: string

    @Field()
    confirmed: boolean
}
