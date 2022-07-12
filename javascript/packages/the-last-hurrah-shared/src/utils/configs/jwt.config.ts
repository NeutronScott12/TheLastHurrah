import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

class JwtOptions {
    static getJwtModuleOptions(configService: ConfigService): JwtModuleOptions {
        return {
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        };
    }
}

export const asyncJwtOptions: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) =>
        JwtOptions.getJwtModuleOptions(configService),
    inject: [ConfigService],
};
