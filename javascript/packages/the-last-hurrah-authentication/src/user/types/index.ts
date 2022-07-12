export interface IUserEmailArgs {
    username: string
    email: string
    id: string
}

export interface TwoFactorArgs {
    user_id: string
    email: string
}

export interface IUnknownClientLoginArgs {
    email: string
    user_ip: string
}
