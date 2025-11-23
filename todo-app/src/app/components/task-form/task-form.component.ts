import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  form!: FormGroup;
  isEdit: boolean = false;
  editId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['']
    });

    // Check if editing task
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.isEdit = true;
      const task = this.taskService.getTaskById(this.editId);
      if (task) {
        this.form.patchValue(task);
      }
    }
  }

  save() {
    if (this.form.invalid) return;

    const data: Task = {
      id: this.editId || Date.now().toString(),
      ...this.form.value
    };

    if (this.isEdit) {
      this.taskService.updateTask(data.id, data);
    } else {
      this.taskService.addTask(data);
    }

    this.router.navigate(['/']);
  }

  close() {
    this.router.navigate(['/']);
  }
}
