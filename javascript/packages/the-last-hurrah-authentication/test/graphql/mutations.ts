export const registerGql = (
    username: string,
    email: string,
    password: string,
) => `
    mutation {
        register_user(
            registrationInput: {
                username: "${username}"
                email: "${email}"
                password: "${password}"
            }
        ) {
            success
            message
        }
    }`

export const loginGql = (email: string, password: string) => `
    mutation {
        login_user(loginInput: {
            email: "${email}"
            password: "${password}"
        }) {
            ... on LoginResponse {
                success
                message
                token
                refresh_token
                two_factor_authentication
                user {
                    username
                    id
                }
            }
            ... on TwoFactorLoginResponse {
                success
                message
                two_factor_authentication
            }
        }
    }
`

export const deleteGql = (email: string) => `
    mutation {
        delete_user(email: "${email}") {
            success
            message
        }
    }
`

export const changePasswordGql = (email: string, password: string) => `
    mutation {
        change_password(
            changePasswordInput: {
               email: "${email}"
               password: "${password}"
            }
        ) {
            success
            message
        }
    }
`
