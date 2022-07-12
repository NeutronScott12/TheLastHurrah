import { hash, compare } from 'bcryptjs';
import {
    sign,
    verify,
    decode,
    DecodeOptions,
    VerifyOptions,
    SignOptions,
} from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
    return await hash(password, 10);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string,
): Promise<Boolean> => {
    return await compare(password, hashedPassword);
};

export const createToken = (
    data: string | {} | [],
    secret: string,
    options: SignOptions,
    refreshSecret: string | undefined = undefined,
    refreshData: string | {} | [] | undefined = undefined,
): string[] => {
    try {
        const token = sign(data, secret, options);

        if (refreshSecret && refreshData) {
            const refreshToken: string = sign(
                refreshData,
                refreshSecret,
                options,
            );
            return [token, refreshToken];
        }

        return [token];
    } catch (error) {
        return error;
    }
};

export const verifyToken = (
    token: string,
    secret: string,
    options?: VerifyOptions,
): string | {} => {
    return verify(token, secret, options);
};

export const decodeToken = (
    token: string,
    options?: DecodeOptions,
):
    | string
    | {
          [key: string]: any;
      }
    | null => {
    if (typeof token === 'string') {
        return decode(token, options);
    } else {
        return new Error('Please enter a string based token');
    }
};
