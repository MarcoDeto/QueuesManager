import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap  } from "rxjs/operators";
import { Router } from "@angular/router";
//import { UserService } from "../../Core/Services/user.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  authorizationData = 'Basic ' + btoa("I4IOTGateway" + ':' + "I4IOTGateway");

  constructor(private router:Router/*, private userService: UserService*/){
    //this.userService.Token.subscribe((tok : string) => this.token = tok);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.authorizationData != ""){
      console.log(req);
      console.log(this.authorizationData);
      const clonedReq = req.clone({ headers: req.headers.set('Authorization', this.authorizationData) });
      return next.handle(clonedReq).pipe(

        tap(
          succ => {
            //this.userService.yes();
          },
          error => {
            if(error.status == 401){
              //this.userService.removeToken();
              this.router.navigate(['/login']);
            }
            else if(error.status == 403){
              this.router.navigate(['/forbidden']);
            }
          }
        )
      );
    }
    else{
      return next.handle(req.clone());
    }

  }

}
