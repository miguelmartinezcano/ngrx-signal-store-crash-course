import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSuffix } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodosStore } from '../store/todos.store';
import { MatSelectionList } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListOption } from '@angular/material/list';

@Component({
  selector: 'todos-list',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatSuffix, MatButtonToggleModule, MatSelectionList, MatCheckboxModule, MatListOption],
  templateUrl: './todos-list.html',
  styleUrl: './todos-list.scss',
})
export class TodosList {
  store = inject(TodosStore);
}
