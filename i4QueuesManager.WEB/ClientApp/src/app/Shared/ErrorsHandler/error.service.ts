import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class ErrorService {

    constructor(
      private http: HttpClient
    ) { }

      /*PostError(error: any): Observable<any> {
          return this.http.post(environment.Error + '/Post', error);
      }*/
  }
