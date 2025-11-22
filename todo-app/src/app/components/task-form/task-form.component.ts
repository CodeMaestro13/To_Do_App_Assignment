import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder,Validators} from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent  implements OnInit{

  form!:FormGroup;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
      this.form = this.fb.group({
        title: ['', Validators.required],
        description: [''],
        dueDate: ['']
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = id;
      const task = this.taskService.getTaskById(id);
      if (task) {
        this.form.patchValue({
          // title: task.title,
          // description: task.description,
          // dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    if (this.editingId) {
      this.taskService.updateTask(this.editingId, val);
    } else {
      this.taskService.addTask(val);
    }
    this.router.navigate(['/tasks']);
  }

  onCancel() { this.router.navigate(['/tasks']); }
}
