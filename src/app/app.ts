import { Component, inject } from '@angular/core';
import { TodosStore } from './store/todos.store';
import { TodosList } from './todos-list/todos-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodosList, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  store = inject(TodosStore);
  
  // ngOnInit(): void {
  //   this.loadTodos()
  //     .then(() => {
  //       console.log('Todos loaded');
  //     })
  //     .catch((error) => {
  //       console.error('Error loading todos:', error);
  //     });
  // }

  // async loadTodos() {
  //   await this.store.loadAll();
  // }
}
