import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid'; // npm i uuid

const STORAGE_KEY = 'todo_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(this.load());

  private load(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    this.tasks$.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  addTask(task: Partial<Task>) {
    const newTask: Task = {
      id: uuidv4(),
      title: task.title || 'Untitled',
      description: task.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: task.dueDate ??  undefined    };
    const tasks = [...this.tasks$.value, newTask];
    this.persist(tasks);
    return newTask;
  }

  updateTask(id: string, updatedFields: Partial<Task>) {
    const tasks = this.tasks$.value.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    this.persist(tasks);
  }

  deleteTask(id: string) {
    const tasks = this.tasks$.value.filter(t => t.id !== id);
    this.persist(tasks);
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks$.value.find(t => t.id === id);
  }
}
