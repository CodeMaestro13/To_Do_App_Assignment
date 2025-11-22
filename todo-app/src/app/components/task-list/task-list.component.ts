import { TaskService } from './../../services/task.service';
import { Component,OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit{

  tasks$!: Observable<Task[]>;

  constructor(private taskService:TaskService,private router: Router){}

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks();
  }

  editTask(id: string) {
    this.router.navigate(['/tasks/edit', id]);
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  toggleCompletion(task: Task) {
    this.taskService.updateTask(task.id, { completed: !task.completed });
  }


}
