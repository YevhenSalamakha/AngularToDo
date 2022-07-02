import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Itask } from '../model/task';

@Injectable({
  providedIn: 'root',
})
export class todoTasksService {
  baseUrl: string = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  postDoneTasks(data:any):Observable<any> {
    return this.http.post<Itask>(`${this.baseUrl}`, data)
  }
}
