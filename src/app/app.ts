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
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('to-do-list-frontend');

  protected toDoList = signal<ToDoItem[]>([]);

  protected showModal = signal(false)

  protected darkMode = signal(false);

  protected newTodoList = new FormControl('');

  handleSubmitData() {
    const newItem: ToDoItem = {
      id: this.toDoList().length + 1,
      title: this.newTodoList.value || 'Untitled Task',
      completed: false
    };

    this.toDoList.update(list => [...list, newItem]);
    this.newTodoList.setValue('');
    this.showModal.set(false);
  }


  handleCheckboxChange(id: number) {
    this.toDoList.update(list =>
      list.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  handleShowModal(isOpen: boolean) {
    this.showModal.set(isOpen);
  }



  toggleTheme() {
    this.darkMode.update(isDark => !isDark);
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
