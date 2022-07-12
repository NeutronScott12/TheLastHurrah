import { Observable } from 'rxjs'
import { IActionComplete } from '../common-grpc.types'

export interface CommentService {
    deleteCommentsByThreadId: (
        args: IDeleteCommentsByThreadIdArgs,
    ) => Observable<IActionComplete>
}

export interface IDeleteCommentsByThreadIdArgs {
    thread_id: string
}
