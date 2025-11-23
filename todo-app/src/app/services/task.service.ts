import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private storageKey = 'tasks';
  private tasks: Task[] = [];

  private taskSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.taskSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /** Load saved tasks from LocalStorage */
  private loadFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    this.tasks = data ? JSON.parse(data) : [];
    this.taskSubject.next(this.tasks);
  }

  /** Save updated tasks back to LocalStorage */
  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    this.taskSubject.next(this.tasks);
  }

  /** Get observable list */
  getTasks() {
    return this.tasks$;
  }

  /** Get one task by ID */
  getTaskById(id: string): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  /** Add new task */
  addTask(task: Task) {
    this.tasks.push(task);
    console.log(this.tasks);
    this.saveToStorage();
  }

  /** Update a task */
  updateTask(id: string, updated: Partial<Task>) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updated };
      this.saveToStorage();
    }
  }

  /** Delete task */
  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage();
  }
}
