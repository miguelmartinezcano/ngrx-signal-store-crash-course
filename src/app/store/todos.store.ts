import { Todo } from "../model/todo.model";
import { signalStore, withState, withMethods, patchState, withComputed, withHooks, withProps } from "@ngrx/signals";
import { TodosService } from "../services/todos.service";
import { inject } from "@angular/core";
import { computed } from "@angular/core";

export type TodosFilter = 'all' | 'pending' | 'completed';

export type TodosState = {
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
    withComputed((state) => ({
        filteredTodo: computed(() => {
            const todos = state.todos();
            switch (state.filter()) {
                case 'all':
                    return todos;
                case 'pending':
                    return todos.filter(todo => !todo.completed);
                case 'completed':
                    return todos.filter(todo => todo.completed);
            }
        })
    })),
    //Used to inject services and other dependencies for the store to use
    withProps(() => ({
        todosService: inject(TodosService)
    })),
    withMethods(
        (store) => ({
          async loadAll() {
            patchState(store, { loading: true });
            const todos = await store.todosService.getTodos();
            patchState(store, { todos, loading: false });
          },  
          async addTodo(title: string) {
            const todo = await store.todosService.addTodo({ title, completed: false });
            patchState(store, (state) => ({
              todos: [...state.todos, todo]
            }));
          },
          async deleteTodo(id: number) {
            await store.todosService.deleteTodo(id);
            patchState(store, (state) => ({
              todos: state.todos.filter(todo => todo.id !== id)
            }));
          },
          async updateTodo(id: number, completed: boolean) {
            await store.todosService.updateTodo(id, completed);
            patchState(store, (state) => ({
              todos: state.todos.map(todo => 
                todo.id === id ? { ...todo, completed } : todo)
            }));
          },
          updateFilter(filter: TodosFilter) {
            patchState(store, { filter });
          }
        })
    ),
    withHooks((store) => ({
      onInit: () => {
        store.loadAll();
      },
      //Useful for component level stores as clean-up
      onDestroy: () => {
        // No cleanup needed for this store as it is global
      }
    }))
)
