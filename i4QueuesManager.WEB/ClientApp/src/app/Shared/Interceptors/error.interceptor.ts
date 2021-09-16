import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            console.log(error.error.message);
            if (error.status == 401) {
              this.snackBar.open("Access Denied", "Errore", {
              duration: 2000,
              panelClass: "error"
              });
            }
            else {
              this.snackBar.open(error.error.message, "Errore", {
                duration: 2000,
                panelClass: "error"
              });
            }
          }
          return throwError(error);
        })
      )
  }
}
