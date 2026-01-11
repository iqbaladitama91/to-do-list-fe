import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface ToDoItem {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('to-do-list-frontend');

  protected toDoList = signal<ToDoItem[]>([]);
  protected searchList = signal<ToDoItem[]>([]);

  protected showModal = signal(false);

  protected darkMode = signal(false);

  protected isEdit = signal<boolean>(false);
  protected editId = signal<number | null>(null);

  protected newTodoList = new FormControl('', { nonNullable: true });
  protected txtSearch = new FormControl('', { nonNullable: true });
  protected isSearch = signal(false);

  protected handleDeleteItem(id: number) {
    this.toDoList.update((list) => list.filter((item) => item.id !== id));
  }

  protected handleSearch() {
    this.searchList.set(
      this.toDoList().filter((item) =>
        item.title.toLowerCase().includes(this.txtSearch.value.toLowerCase())
      )
    );
    this.isSearch.set(true);
  }

  protected handleCancelSearch() {
    this.isSearch.set(false);
    this.txtSearch.setValue('');
    this.searchList.set([]);
  }

  protected handleEditItem(id: number) {
    this.showModal.set(true);
    const data = this.toDoList().find((item) => item.id === id);
    this.newTodoList.setValue(data?.title || '');
    this.editId.set(id);
    this.isEdit.set(true);
  }

  handleSubmitData() {
    if (this.isEdit()) {
      this.toDoList.update((list) =>
        list.map((item) =>
          item.id === this.editId() ? { ...item, title: this.newTodoList.value } : item
        )
      );
      this.isEdit.set(false);
      this.editId.set(null);
    } else {
      const newItem: ToDoItem = {
        id: this.toDoList().length + 1,
        title: this.newTodoList.value || 'Task Apalah Ini',
        completed: false,
      };
      this.toDoList.update((list) => [...list, newItem]);
    }
    this.newTodoList.setValue('');
    this.showModal.set(false);
  }

  handleCheckboxChange(id: number) {
    this.toDoList.update((list) =>
      list.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }

  handleShowModal(isOpen: boolean) {
    this.showModal.set(isOpen);
  }

  toggleTheme() {
    this.darkMode.update((isDark) => !isDark);
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
