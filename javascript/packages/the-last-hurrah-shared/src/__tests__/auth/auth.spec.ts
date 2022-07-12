import {
    comparePassword,
    createToken,
    hashPassword,
} from '../../utils/auth/helpers';

function sum(a, b) {
    return a + b;
}

describe('Testing auth helpers', () => {
    test('To create a hash', () => {
        expect(hashPassword('bob')).toBeDefined();
    });

    test('Testing password compare', async () => {
        let name = 'bob';
        const hashedPassword = await hashPassword(name);

        expect(comparePassword(name, hashedPassword)).toBeTruthy();
        expect(await comparePassword('bobby', hashedPassword)).toBeFalsy();
    });

    test('Creating Tokens', () => {
        expect(
            createToken('bob', 'secret', {}, 'refresh_secret', 'harry'),
        ).toHaveLength(2);
    });
});
