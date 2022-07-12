import * as yup from 'yup';

export let RegisterSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email(),
    password: yup.string().required().min(3),
});

export let LoginSchema = yup.object().shape({
    email: yup.string().email(),
    password: yup.string().required(),
});

export let EmailSchema = yup.object().shape({
    email: yup.string().email(),
});

export const repeatPasswordSchema = yup.object().shape({
    password: yup.string().required().min(3),
    repeatPassword: yup.string().required().min(3),
});
