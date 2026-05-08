import { Todo } from "../model/todo.model";
import { signalStore, withState, withMethods, patchState, withComputed, withHooks, withProps } from "@ngrx/signals";
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { TodosService } from "../services/todos.service";
import { inject } from "@angular/core";
import { computed } from "@angular/core";

export type TodosFilter = 'all' | 'pending' | 'completed';

export type TodosState = {
    loading: boolean;
    filter: TodosFilter;
}

const initialState: TodosState = {
    loading: false,
    filter: 'all'
}

export const TodosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    //Using withEntities to manage the collection of todos in the store
    withEntities<Todo>(),
    //Used to inject services and other dependencies for the store to use
    withProps(() => ({
        todosService: inject(TodosService)
    })),
    withComputed((store) => ({
        filteredTodos: computed(() => {
            const todos = store.entities();
            switch (store.filter()) {
                case 'all':
                    return todos;
                case 'pending':
                    return todos.filter(todo => !todo.completed);
                case 'completed':
                    return todos.filter(todo => todo.completed);
            }
        })
    })),
    withMethods(
        (store) => ({
          async loadAll() {
            patchState(store, { loading: true });
            const todos = await store.todosService.getTodos();
            patchState(
              store,
              setAllEntities(todos),
              { loading: false }
            );
          },  
          async addTodo(title: string) {
            const todo = await store.todosService.addTodo({ title, completed: false });
            patchState(store, addEntity(todo));
          },
          async deleteTodo(id: number) {
            await store.todosService.deleteTodo(id);
            patchState(store, removeEntity(id));
          },
          async updateTodo(id: number, completed: boolean) {
            await store.todosService.updateTodo(id, completed);
            patchState(
              store, 
              updateEntity(
                {
                  id,
                  changes: {
                    completed
                  }
                }
              )
            );
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
