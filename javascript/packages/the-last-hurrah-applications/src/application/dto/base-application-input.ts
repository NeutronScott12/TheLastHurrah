import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { CATEGORY, LANGUAGE, THEME } from '@prisma/client'

registerEnumType(CATEGORY, {
    name: 'CATEGORY',
})

registerEnumType(LANGUAGE, {
    name: 'LANGUAGE',
})

registerEnumType(THEME, {
    name: 'THEME',
})

@InputType()
export class BaseApplicationInput {
    @Field()
    application_short_name: string

    @Field({ nullable: true })
    website_url: string

    @Field(() => CATEGORY)
    category: CATEGORY

    @Field(() => LANGUAGE)
    language: LANGUAGE

    @Field(() => THEME)
    theme: THEME

    @Field(() => Boolean)
    adult_content: boolean

    @Field({ nullable: true })
    comment_policy_url: string

    @Field({ nullable: true })
    comment_policy_summary: string

    @Field({ nullable: true })
    description: string

    @Field({ nullable: true })
    default_avatar_url: string
}
