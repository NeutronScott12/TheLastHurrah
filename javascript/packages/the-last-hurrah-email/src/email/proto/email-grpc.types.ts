import { Observable } from 'rxjs'

export interface IEmailService {
    sendEmail: (args: ISendEmailArgs) => Observable<IActionComplete>
}

export interface ISendEmailArgs {
    from: string
    to: string
    subject: string
    html: string
}

export interface IActionComplete {
    success: boolean
    message: string
}
