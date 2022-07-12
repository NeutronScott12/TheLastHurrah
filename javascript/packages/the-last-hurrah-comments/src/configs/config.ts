import { ConfigModuleOptions } from '@nestjs/config'

import { envVariablesSchema } from 'src/utils/validation/config'

const ENV = process.env.NODE_ENV

export const configOptions: ConfigModuleOptions = {
    envFilePath: ENV == 'development' ? '.env.development' : `.env.${ENV}`,
    isGlobal: true,
    cache: true,
    validationSchema: envVariablesSchema,
    // validationOptions: {
    //     allowUnknown: false,
    //     abortEarly: true,
    // },
    expandVariables: true,
}
