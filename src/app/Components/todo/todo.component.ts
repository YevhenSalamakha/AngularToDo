import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Itask } from 'src/app/model/task';
import { todoTasksService } from 'src/app/services/todoTasks.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  public toDoForm: FormGroup;
  public toDotasks: Itask[] = [];
  public completedTasks: Itask[] = [];
  public updateIndex: number;
  public isEditEnabled: boolean = false;
  private $destroy = new Subject();

  constructor(
    private formbuilder: FormBuilder,
    private todoTasksService: todoTasksService
  ) {}

  ngOnInit(): void {
    this.toDoForm = this.formbuilder.group({
      item: ['', Validators.required],
    });
  }

  public addTask() {
    this.toDotasks.push({
      description: this.toDoForm.value.item,
      done: false,
    });
    this.toDoForm.reset();
  }

  public editTask(item: Itask, index: number) {
    this.toDoForm.controls['item'].setValue(item.description);
    this.updateIndex = index;
    this.isEditEnabled = true;
  }

  public updateTask() {
    this.toDotasks[this.updateIndex].description = this.toDoForm.value.item;
    this.toDotasks[this.updateIndex].done = false;
    this.toDoForm.reset();

    this.isEditEnabled = false;
  }

  public deleteToDoTask(index: number) {
    console.log(this.toDotasks);
    this.toDotasks.splice(index, 1);
    console.log(this.toDotasks[this.updateIndex]);
    console.log(index);
  }

  public deleteCompletedTask(index: number) {
    this.completedTasks.splice(index, 1);
  }

  public request() {
    this.todoTasksService
      .postDoneTasks(this.completedTasks)
      .pipe(takeUntil(this.$destroy))
      .subscribe((response) => {
        console.log(response);
      });
  }

  public drop(event: CdkDragDrop<Itask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
