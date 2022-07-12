import { createTransport } from 'nodemailer';
import { createToken } from '../auth/helpers';

interface EmailArgs {
    id: string;
    username: string;
    email: string;
}

interface Email {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const generateUrl = async (
    { id, username, email }: EmailArgs,
    url: string,
    secret: string,
): Promise<string> => {
    try {
        const [token]: string[] = createToken({ id, username, email }, secret, {
            expiresIn: '24h',
        });

        const link: string = `${url}?t=${token}`;

        return link;
    } catch (error) {
        return error;
    }
};

const setup = () => {
    return createTransport({
        service: 'Gmail',
        auth: {
            user: '',
            pass: '',
        },
    });

    // if (process.env.NODE_ENV === 'production') {
    // return createTransport(
    //     sgTransport({
    //         auth: {
    //             api_key: SENDGRID_API_KEY,
    //         },
    //     }),
    // )
    // } else {
    //     return createTransport({
    //         host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    //         port: process.env.EMAIL_PORT || 2525,
    //         auth: {
    //             user: process.env.EMAIL_USER || '984c1182cd3546',
    //             pass: process.env.EMAIL_PASS || 'c468fcdc66d05b',
    //         },
    //     } as any)
    // }
};

export const sendResetPasswordEmail = async (
    user: EmailArgs,
    url: string,
    secret: string,
    from: string,
) => {
    try {
        const transport = setup();

        const emailUrl = await generateUrl(user, url, secret);

        const email: Email = {
            from,
            to: user.email,
            subject: 'Reset Password',
            html: `
				To reset password follow this link
				<a href="${emailUrl}">Reset Link</a>
			`,
        };

        transport.sendMail(email);
    } catch (error) {
        console.log(error);
    }
};

export const sendConfirmationEmail = async (
    user: EmailArgs,
    url: string,
    secret: string,
    from: string,
) => {
    try {
        const transport = setup();

        const emailUrl = await generateUrl(user, url, secret);

        const email: Email = {
            from,
            to: user.email,
            subject: 'Confirmation Email',
            html: `
                <h1>Welcome, please click link to confirm</h1>
                <a href="${emailUrl}">Confirmation Link</p>
            `,
        };

        transport.sendMail(email);
    } catch (error) {
        return error;
    }
};
