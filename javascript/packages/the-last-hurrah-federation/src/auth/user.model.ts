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
@Directive('@extends')
@Directive('@key(fields: "id")')
// @Entity('Users')
export class UserModel {
    @Field((type) => ID)
    // @PrimaryGeneratedColumn()
    @Directive('@external')
    // @Directive('@external')
    id: number

    @Field((type) => Date)
    // @CreateDateColumn()
    createdAt: Date

    @Field((type) => Date)
    // @UpdateDateColumn()
    updatedAt: Date

    // @Column({
    //     type: 'enum',
    //     enum: Roles,
    //     default: Roles.USER,
    // })
    @Field()
    userRole: string

    // @Column({ unique: true })
    @Field()
    email: string

    // @Column({ unique: true })
    @Field()
    username: string

    // @Column()
    password: string

    // @Column({ default: false, nullable: true })
    @Field()
    confirmed: boolean
}
