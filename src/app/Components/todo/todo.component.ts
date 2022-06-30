import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Itask } from 'src/app/model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  toDotasks: Itask[] = [];
  inprogressTasks: Itask[] = [];
  doneTasks: Itask[] = [];
  updateIndex!: any;
  isEditEnabled: boolean = false;
  
  constructor(private formbuilder: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.formbuilder.group({
      item: ['', Validators.required],
    });

    this.watchdone();
  }

  addTask() {
    this.toDotasks.push({
      description: this.todoForm.value.item,
      done: false,
    });
    this.todoForm.reset();
  }

  editTask(item: Itask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  updateTask() {
    this.toDotasks[this.updateIndex].description = this.todoForm.value.item;
    this.toDotasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  deleteToDoTask(i: number) {
    this.toDotasks.splice(i, 1);
  }

  deleteInProgressTask(i: number) {
    this.inprogressTasks.splice(i, 1);
  }

  deleteDoneTask(i: number) {
    this.doneTasks.splice(i, 1);
  }

  watchdone() {
    console.log(this.doneTasks);
  }

  request() {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        doneTasks: this.doneTasks,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  drop(event: CdkDragDrop<Itask[]>) {
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
}
