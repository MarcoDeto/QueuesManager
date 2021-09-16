import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { QueuesService } from '../../Services/queues.service';
import { Queue, QueueDTO } from '../../Models/Queue.model';
import { Connection } from '../../Models/Connection.model';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { requestQueue } from '../../Models/Requests.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'Home';

  localid = navigator.language;
  subscribers: Subscription[] = [];

  hidePassword = true;

  queues: Queue[] = [];
  queuesName: string[] = [];

  vhosts: any[] = [];
  virtualHost = "";

  refreshTime = 5000;
  intervalRefresh: any = undefined;

  connectionForm = this.formBuilder.group({
    addressIp: ["127.0.0.1", [Validators.required, Validators.maxLength(15)]],
    username: ["guest", [Validators.required, Validators.maxLength(20)]],
    password: ["guest", [Validators.required, Validators.maxLength(20)]],
  });

  displayedColumns: string[] = [''];

  selected: Queue[] = [];

  request: requestQueue = {
    xqueuetype: "classic",
    auto_delete: "false",
    durable: "false",
    name: "",
    vhost: "/"
  }

  queue: QueueDTO = {
    countMessage: 0,
    name: "",
    virtualHost: "",
    argomenti: null,
    autoDelete: false,
    durable: false,
    exclusive: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private queuesService: QueuesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {

    translate.addLangs(['en', 'it']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|it/) ? browserLang : 'en');
   }

  ngOnInit(): void {
    this.connectionForm.get("addressIp").setValue(this.queuesService.getAddressIp());
    this.connectionForm.get("username").setValue(this.queuesService.getusername());
    this.connectionForm.get("password").setValue(this.queuesService.getPassword());
    if (this.getWidth() > 415) { this.displayedColumns = ['img', 'select', 'name', 'ready', 'unacked', 'total']; }
    else { this.displayedColumns = ['select', 'name', 'ready', 'unacked', 'total']; }

    this.connect();
  }

  connect() {
    this.stop();
    this.subscribers.push(this.queuesService.connection(this.connectionForm.value).subscribe(
      res => {
        if (res.name == this.connectionForm.get("username").value) {
          this.start();
          this.getVhosts();
        }
      },
      err => {
        this.queues = [];
      }
    ));
  }

  getVhosts() {
    this.subscribers.push(this.queuesService.getVhosts().subscribe(
      res => this.vhosts = res
    ));
  }

  start() {
    this.queuesService.setSession(this.connectionForm.value);
    this.getQueues();
    this.changeInverval(this.refreshTime);
  }

  stop() { clearInterval(this.intervalRefresh); }

  changeInverval(_interval: number) {
    clearInterval(this.intervalRefresh);
    if (this.refreshTime < 5000) { return; }
    this.intervalRefresh = setInterval(() => {
      console.log(_interval);
      this.getQueues();
    }, _interval);
  }

  changeVhost() {
    this.stop();
    this.queuesService.setVhost(this.virtualHost);
    this.start();
  }

  onSubmit() {
    console.log("GET CONNECTION");
    this.queuesService.setSession(this.connectionForm.value);
    this.start();
  }

  getQueues() {
    console.log("GET QUEUES");
    this.subscribers.push(this.queuesService.getAll().subscribe(
      res => {
        this.queues = [];
        res.forEach(queue => {
          if (this.virtualHost == "" || queue.vhost == this.virtualHost) { this.queues.push(queue); }
        });
        this.selected.forEach(queue => {
          this.queues.filter(x => x.name == queue.name && x.vhost == queue.vhost)[0].checked = true;
        });
        this.selected = [];
        this.queues.forEach(queue => {
          if (queue.checked == true) { this.selected.push(queue); }
        });
      },
      err => {
        this.queuesService.isAuthenticated("false");
        this.queues = [];
        clearInterval(this.intervalRefresh);
      }
    ));
  }

  showMessages(queue: any) {
    var count = queue.backing_queue_status.len;
    if (count == 0) {
      Swal.fire({
        title: 'There are no ready-to-read messages',
        customClass: {
          popup: "sweet-popup",
          actions: "sweet-actions",
        }
      });
    }
    else {
      this.queuesService.setVhost(queue.vhost);
      this.router.navigate(['queue', queue.name, count]);
      this.stop();
    }
  }

  selectAll() {
    if (this.selected.length == 0) {
      this.queues.forEach(
        x => {
          x.checked = true;
          this.selected.push(x);
        }
      );
    }
    else {
      this.queues.forEach(x => x.checked = false);
      this.selected = [];
    }
  }

  changeSelection(checked: boolean, queue: Queue): void {
    if (checked == true) {
      this.selected.push(queue);
    }
    else {
      var position = this.selected.indexOf(queue);
      this.selected.splice(position, 1);
    }
  }

  addQueue() {
    console.log(this.virtualHost);
    if (this.virtualHost == "") {
      Swal.fire({
        title: 'Please select a virtual host',
        customClass: {
          popup: "sweet-popup",
          actions: "sweet-actions",
        }
      });
      return;
    }
    Swal.fire({
      title: 'Add a new queue',
      html: 'insert a name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      customClass: {
        title: 'sweet-title',
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value == "" || result.value == null) {
          this.snackBar.open("Insert a queue name", "Error", {
            duration: 1000,
          });
          this.addQueue();
          return;
        }
        this.request.name = result.value;
        this.request.vhost = this.virtualHost;
        this.stop();
        this.subscribers.push(this.queuesService.addQueue(this.request).subscribe(
          res => {
            this.snackBar.open(result.value + " queue adding", "Please wait", {
              duration: 5000,
              panelClass: "Success"
            });
            setTimeout(() => {
              this.start();
              this.snackBar.open(result.value + " queue added", "Done", {
                duration: 2000,
                panelClass: "Success"
              });
            }, 5000);
          }
        ));
      }
    })
  }

  purgeQueues() {
    var title = 'No queues selected';
    if (this.selected.length == 0) {
      Swal.fire({
        icon: 'error',
        title: title,
        customClass: {
          popup: "sweet-popup",
          actions: "sweet-actions"
        }
      });
    }
    else {
      title = 'Sure you want to purge all selected queues?';
      Swal.fire({
        icon: 'question',
        title: title,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        customClass: {
          actions: "sweet-actions",
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.stop();
          this.selected.forEach(x => this.queuesName.push(x.name));
          this.subscribers.push(this.queuesService.purgeQueues(this.queuesName).subscribe(
            res => {
              this.snackBar.open("Queues purging", "Please wait", {
                duration: 4000,
                panelClass: "Success"
              });
              this.getQueues();
              setTimeout(() => {
                this.snackBar.open("Queues purged", "Done", {
                  duration: 2000,
                  panelClass: "Success"
                });
              }, 4000);
            }
          ));
        }
      });
    }
  }

  deleteQueues() {
    var title = 'No queues selected';
    if (this.selected.length == 0) {
      if (this.selected.length == 0) {
        Swal.fire({
          icon: 'error',
          title: title,
          customClass: {
            popup: "sweet-popup",
            actions: "sweet-actions"
          }
        });
      }
    }
    else {
      title = 'Sure you want to delete all selected queues?'
      Swal.fire({
        icon: 'question',
        title: title,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        customClass: {
          actions: "sweet-actions",
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.stop();
          do {
            this.selected.forEach((queue, i) => {
              setTimeout(() => {
                this.deleteQueue(queue.name, queue.vhost);
                var position = this.selected.indexOf(queue);
                this.selected.splice(position, 1);
              }, i * 500);
            });
          }
          while (this.selected.length == 0);
          this.start();
        }
      });
    }
  }

  deleteQueue(name: string, vhost: string) {
    this.subscribers.push(this.queuesService.deleteQueue(name, vhost).subscribe(
      res => {
        this.getQueues();
        this.snackBar.open(name + " queue is deleted", "Done", {
          duration: 1000,
          panelClass: "Success"
        });
      }
    ));
  }

  getWidth(): number {
    return window.innerWidth;
  }

  ngOnDestroy(): void {
    this.stop();
    this.subscribers.forEach(s => s.unsubscribe());
    this.subscribers.splice(0);
    this.subscribers = [];
  }

}
