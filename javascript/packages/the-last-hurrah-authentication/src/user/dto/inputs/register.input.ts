import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from '@nestjs/class-validator'

@InputType()
export class RegisterInputService {
    @Field(() => String)
    username: string

    @IsEmail()
    @Field(() => String)
    email: string

    @Field(() => String)
    password: string

    @Field(() => String, { nullable: true })
    application_id: string

    @Field({ nullable: true })
    application_short_name: string
}

@InputType()
export class RegisterInput extends RegisterInputService {
    @Field(() => String, { nullable: true })
    redirect_url: string
}
