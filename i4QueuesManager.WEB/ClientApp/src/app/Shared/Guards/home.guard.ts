import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
//import { UserService } from '../../Core/Services/user.service';
//import { Response } from '../../Authentication/Models/response.model';
import * as moment from "moment";
import { Subscription } from "rxjs";


@Injectable({
  providedIn:'root'
})
export class HomeGuard implements CanActivate {

  subscribers: Array<Subscription>;
  constructor(private router: Router/*, private userService: UserService*/) {
    this.subscribers = [];
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(s => s.unsubscribe());
    this.subscribers.splice(0);
    this.subscribers = [];
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    /*let token = "";
    this.userService.Token.subscribe((tok : string) => token = tok);
    if (this.userService.IsAuthenticated && token != "") {
      return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }*/
    return true;
  }
}
