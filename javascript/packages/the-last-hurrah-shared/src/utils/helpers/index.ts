import { Logger } from '@nestjs/common';
import { arch, platform } from 'os';

export const startUpMessages = (url: string, server_name: string) => {
    const enviroment = process.env.NODE_ENV;
    const messages: string[] = [
        `Running on: ${url}`,
        `Server name: ${server_name}`,
        `Current development status: ${enviroment}`,
        `Operating system: ${platform()} ${arch()}`,
    ];
    messages.map((message) => Logger.log(message, 'ConnectionInfo'));
};
