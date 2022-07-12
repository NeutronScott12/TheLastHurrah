import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from './app.module'

describe('App Module', () => {
    let module: TestingModule

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
    })

    it('Should be defined', () => {
        expect(module).toBeDefined()
    })

    afterAll(async () => {
        await module.close()
    })
})
