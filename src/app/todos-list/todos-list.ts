import { Component, effect, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSuffix } from '@angular/material/form-field';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodosStore } from '../store/todos.store';
import { MatSelectionList } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListOption } from '@angular/material/list';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { TodosFilter } from '../store/todos.store';

@Component({
  selector: 'todos-list',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSuffix, MatButtonToggleModule, MatSelectionList, MatCheckboxModule, MatListOption, MatButtonToggleGroup],
  templateUrl: './todos-list.html',
  styleUrl: './todos-list.scss',
})
export class TodosList {
  store = inject(TodosStore);

  filter = viewChild.required(MatButtonToggleGroup);

  constructor() {
    effect(() => {
      const filter = this.filter();
      filter.value = this.store.filter();
    });
  }

  async onAddTodo(title: string) {
    await this.store.addTodo(title);
  }

  async onDeleteTodo(id: number, event: MouseEvent) {
    event.stopPropagation();
    await this.store.deleteTodo(id);
  }

  async onTodoToggled(id: number, completed: boolean) {
    await this.store.updateTodo(id, completed);
  }

  onFilterTodos(event: MatButtonToggleChange) {
    const filter = event.value as TodosFilter;
    this.store.updateFilter(filter);
  }
}
