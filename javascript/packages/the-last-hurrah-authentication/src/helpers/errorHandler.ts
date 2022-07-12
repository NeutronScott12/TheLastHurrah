import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

export const errorHandler = (error: any) => {
    if (error instanceof PrismaClientKnownRequestError) {
        console.log('RUNNING')
        throw new ConflictException({
            success: false,
            message: 'Record already exists',
        })
    } else {
        throw new InternalServerErrorException({
            success: false,
            message: error.message,
        })
    }
}
