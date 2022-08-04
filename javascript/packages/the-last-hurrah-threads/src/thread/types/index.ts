export interface ISendEmailToThreadSubscribersArgs {
    email: string
    thread_title: string
    thread_url: string
}

export interface ISetThreadCloseArgs {
    thread_title: string
    thread_id: string
}
