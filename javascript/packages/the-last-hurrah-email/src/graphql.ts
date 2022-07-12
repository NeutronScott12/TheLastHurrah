
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateTodoInput {
    todo: string;
}

export interface UpdateTodoInput {
    todo?: Nullable<string>;
    id: string;
}

export interface Todo {
    id: string;
    todo: string;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface IQuery {
    fetch_all_todos(): Todo[] | Promise<Todo[]>;
    find_one_todo(id: string): Todo | Promise<Todo>;
}

export interface IMutation {
    create_todo(createTodoInput: CreateTodoInput): Todo | Promise<Todo>;
    update_todo(updateTodoInput: UpdateTodoInput): Todo | Promise<Todo>;
    remove_todo(id: string): Todo | Promise<Todo>;
}

export type DateTime = any;
type Nullable<T> = T | null;
