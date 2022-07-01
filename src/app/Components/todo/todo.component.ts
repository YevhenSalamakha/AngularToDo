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
  public toDoForm!: FormGroup;
  public toDotasks: Itask[] = [];
  public completedTasks: Itask[] = [];
  public updateIndex!: number;
  public isEditEnabled: boolean = false;

  constructor(private formbuilder: FormBuilder) {}

  ngOnInit(): void {
    this.toDoForm = this.formbuilder.group({
      toDoItem: ['', Validators.required],
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
    this.toDotasks.splice(index, 1);
  }

  public deleteCompletedTask(index: number) {
    this.completedTasks.splice(index, 1);
  }

  request() {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        doneTasks: this.completedTasks,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
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
}
