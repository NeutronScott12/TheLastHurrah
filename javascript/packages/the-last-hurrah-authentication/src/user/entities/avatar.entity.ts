// id             String   @id @default(uuid())
//   filename       String
//   mimetype       String
//   encoding       String
//   key            String
//   ETag           String
//   default_avatar Boolean  @default(true)
//   updated_at     DateTime @updatedAt
//   created_at     DateTime @default(now())
//   url            String   @default("https://res.cloudinary.com/dmxf3jh8t/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1551876589/qzlmu4vxyomehxuo3tat.jpg")

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AvatarEntity {
    @Field()
    id: string

    @Field()
    filename: string

    @Field()
    encoding: string

    @Field()
    key: string

    @Field()
    ETag: string

    @Field()
    url: string

    @Field(() => Boolean)
    default_avatar: boolean

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date
}
