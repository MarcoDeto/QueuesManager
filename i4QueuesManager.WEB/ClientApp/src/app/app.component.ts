import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
//import { UserService } from './Core/Services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from './Shared/Interceptors/loader.interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'Poc-RabbitMQ';
  caricamento = false;

  @ViewChild('sidenav') sidenav: any;

  toggleSidenav() {
    this.sidenav.toggle();
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    public translate: TranslateService
  ) {
    this.subscribers = [];

    translate.addLangs(['en', 'it']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|it/) ? browserLang : 'en');
  }

  subscribers: Subscription[];

  opened = false;
  inAuth = false;
  inLogin = false;
  inNfForb = false;

  token = "";
  userAuthenticated = false;
  userRole = "";
  idUser = "";

  mode = new FormControl('over');

  ngOnInit(): void {
    this.opened = false;
    this.mode = new FormControl('over');

    //this.subscribers.push(this.userService.Token.subscribe(token => this.token = token));
    //this.subscribers.push(this.userService.IsAuthenticated.subscribe(res => this.userAuthenticated = res));
  }

  ngAfterViewInit() {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.renderer.addClass(document.body, 'cursor-loader');
      } else {
        this.renderer.removeClass(document.body, 'cursor-loader');
      }
    });
  }

  getWidth(): number {
    return window.innerWidth;
  }

  /*onRouterOutletActivate(event: any) {
    this.titleService.setTitle(`${this.title} - ${event.title}`);
    if (event.route.url._value[0].path.includes('home')) {
      //this.subscribers.push(this.userService.Token.subscribe(token => this.token = token));
      //this.subscribers.push(this.userService.IsAuthenticated.subscribe(res => this.userAuthenticated = res));
      this.inAuth = false;
      this.inLogin = false;
      this.inNfForb = false;
    }
    if (event.route.url._value[0].path.includes('login')) {
      this.inAuth = true;
      this.inLogin = true;
      this.inNfForb = false;
    }
    else if (event.route.url._value[0].path.includes('register')) {
      this.inAuth = true;
      this.inLogin = false;
      this.inNfForb = false;
    }
    else if (event.title === 'PAGE NOT FOUND' ||
      event.route.url._value[0].path.includes('forbidden')) {
      this.inAuth = false;
      this.inLogin = false;
      this.inNfForb = true;
    }
    else this.inAuth = this.inLogin = this.inNfForb = false;

  }*/

  logout() {
    Swal.fire({
      title: 'Effettuare il Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        /*this.userService.Token.subscribe((tok : string) => this.token = tok);
        if (this.userService.IsAuthenticated && this.token != "") {
          this.userService.removeToken();
          this.router.navigate(['login']);
          this.userService.no();
        }*/
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(s => s.unsubscribe());
    this.subscribers.splice(0);
    this.subscribers = [];
  }

}

