import * as Joi from 'joi'

export const envVariablesSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(4005),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required().default('jwt_secret'),
    GRAPHQL_INTROSPECTION: Joi.boolean().required(),
    REDIS_PORT: Joi.number().required().default(6379),
    REDIS_HOST: Joi.string().required().default('localhost'),
    GRAPHQL_DEBUG: Joi.boolean().required().default(true),
    GRAPHQL_PLAYGROUND: Joi.boolean().required().default(true),
})
