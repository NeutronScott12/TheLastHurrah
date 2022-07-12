import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

export enum SORT {
    ASC = 'asc',
    DESC = 'desc',
    TOP_VOTES = 'top_votes',
}

registerEnumType(SORT, {
    name: 'sort',
})

@InputType()
export class FetchThreadCommentsBySort {
    @Field((type) => Int)
    limit: number

    @Field((type) => Int)
    skip: number

    @Field((type) => SORT, { nullable: true })
    sort: SORT
}
@InputType()
export class FetchCommentByThreadIdInput extends FetchThreadCommentsBySort {
    @Field((type) => String)
    thread_id: string

    @Field((type) => String)
    application_short_name: string

    @Field((type) => SORT)
    sort: SORT
}
