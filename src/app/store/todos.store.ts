import { Todo } from "../model/todo.model";
import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { TodosService } from "../services/todos.service";
import { inject } from "@angular/core";

export type TodosFilter = 'all' | 'active' | 'completed';

type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;
}

const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: 'all'
}

export const TodosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store, todosService = inject(TodosService)) => ({
          async loadAll() {
            patchState(store, { loading: true });
            const todos = await todosService.getTodos();
            patchState(store, { todos, loading: false });
          }  
        })
    )
)
