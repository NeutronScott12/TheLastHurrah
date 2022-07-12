import { Observable } from 'rxjs'
import { IActionComplete } from '../types'

export interface CommentService {
    deleteCommentsByThreadId: (
        args: IDeleteCommentsByThreadIdArgs,
    ) => Observable<IActionComplete>
}

export interface IDeleteCommentsByThreadIdArgs {
    thread_id: string
}
