import { DoCheck, ViewChild } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as Enumerable from 'linq';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Connection } from '../../Models/Connection.model';
import { Message } from '../../Models/Message.model';
import { Queue, QueueDTO } from '../../Models/Queue.model';
import { requestDelete, requestMessage, requestMove } from '../../Models/Requests.model';
import { QueuesService } from '../../Services/queues.service';
import { MoveComponent } from './move/move.component';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit, DoCheck, OnDestroy {
  name = this.route.snapshot.paramMap.get('name');
  count = this.route.snapshot.paramMap.get('count');
  title = this.name;
  subscribers: Subscription[] = [];

  refreshTime = 5000;
  intervalRefresh: any = undefined;

  messages: Message[] = [];
  displayedColumns: string[] = ['select', 'message'];

  queue: QueueDTO = {
    countMessage: 0,
    name: "",
    virtualHost: "",
    argomenti: null,
    autoDelete: false,
    durable: false,
    exclusive: false
  };

  connection: Connection = {
    addressIp: "127.0.0.1",
    username: "guest",
    password: "guest",
  };

  requestMessage: requestMessage = {
    queue: this.queue,
    connection: this.connection
  }

  requestDelete: requestDelete = {
    srcQueue: this.queue,
    messagesToDelete: [],
    connection: this.connection
  }

  selected: Message[] = [];
  deleting = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageEvent: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0
  }
  length = 0;
  skip = 0;
  take = 10;

  constructor(
    private route: ActivatedRoute,
    private queuesService: QueuesService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.skip = this.pageEvent.pageSize * this.pageEvent.pageIndex;
    this.take = this.pageEvent.pageSize;
    this.start();
  }

  ngDoCheck(): void {
    if (this.skip != this.pageEvent.pageSize * this.pageEvent.pageIndex || this.take != this.pageEvent.pageSize) {
      this.skip = this.pageEvent.pageSize * this.pageEvent.pageIndex;
      this.take = this.pageEvent.pageSize;
      this.start();
    }
  }

  start() {
    this.stop();
    console.log("GET QUEUES");
    this.subscribers.push(this.queuesService.getAll().subscribe(
      res => {
        res.forEach(queue => {
          if (queue.name == this.name && queue.vhost == this.queuesService.getVirtualHost()) {
            this.queue.name = queue.name;
            this.queue.countMessage = queue.backing_queue_status.len;
            this.queue.virtualHost = queue.vhost;
            this.queue.durable = queue.durable;
            this.queue.exclusive = queue.exclusive;
            this.queue.autoDelete = queue.auto_delete;
            this.queue.argomenti = queue.arguments;
            this.changeInverval(this.refreshTime);
          }
        });
      }
    ));
  }

  stop() { clearInterval(this.intervalRefresh); }

  changeInverval(_interval: number) {
    clearInterval(this.intervalRefresh);
    if (this.refreshTime < 5000) { return; }
    this.getMessages();
    this.intervalRefresh = setInterval(() => {
      console.log(_interval);
      this.getMessages();
    }, _interval);
  }
  /*
  getMessages() {
    console.log("TEST");
    this.requestMessage.queue = this.queue;
    this.requestMessage.connection = this.queuesService.getParam();
    this.subscribers.push(this.queuesService.getMessages(this.requestMessage, this.skip, this.take).subscribe(
      res => {
        this.queuesService.isAuthenticated("true");

        var indexesSelected: string[] = [];
        this.selected = [];
        this.messages.forEach((message, i) => {
          if (message.checked) { indexesSelected.push(message.messageId); }
        });

        this.messages = res.content;
        this.length = res.count;

        this.messages.forEach((message, i) => {
          if (indexesSelected.includes(message.messageId)) {
            message.checked = true;
            this.selected.push(message);
          }
        });
      },
      error => {
        this.stop;
        this.router.navigate(['home']);
      }
    ));
  }
  */
  getMessages() {
    console.log("TEST");
    this.requestMessage.queue = this.queue;
    this.requestMessage.connection = this.queuesService.getParam();
    this.subscribers.push(this.queuesService.getMessages(this.requestMessage, this.skip, this.take).subscribe(
      res => {
        if (res.content.length == 0) { this.router.navigate(['home']); }
        this.length = res.count;
        this.messages = res.content;
        if (res.content.length > 0) {
          this.selected.forEach(mess => {
            var message = Enumerable.from(this.messages).firstOrDefault(x => x.messageId == mess.messageId && x.message == mess.message);
            if (message != null && message != undefined)
              message.checked = true;
          });
        }
        this.selected = [];
        this.messages.forEach(mess => {
          if (mess.checked == true) { this.selected.push(mess); }
        });
      },
      error => {
        this.stop;
        this.router.navigate(['home']);
      }
    ));
  }
  
  selectAll() {
    if (this.selected.length == 0) {
      this.messages.forEach(
        x => {
          x.checked = true;
          this.selected.push(x);
        }
      );
    }
    else {
      this.messages.forEach(x => x.checked = false);
      this.selected = [];
    }
  }

  changeSelection(checked: boolean, message: Message): void {
    if (checked == true) {
      this.selected.push(message);
    }
    else {
      var position = this.selected.indexOf(message);
      this.selected.splice(position, 1);
    }
    console.log(this.selected);
  }

  moveMessages(): void  {
    var title = 'No message selected';
    if (this.selected.length == 0) {
      Swal.fire({
        icon: 'error',
        title: title,
        customClass: {
          popup: "sweet-popup2",
          actions: "sweet-actions"
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(MoveComponent, {
        width: '90%',
        maxWidth: '60%',
        data: { srcQueue: this.queue, messages: this.selected }
      });
      dialogRef.beforeClosed().subscribe(result => { this.getMessages(); });
      dialogRef.afterClosed().subscribe(result => { this.getMessages(); });
    }
  }

  deleteMessages(): void {
    this.deleting = true;
    var title = 'No message selected';
    if (this.selected.length == 0) {
      Swal.fire({
        icon: 'error',
        title: title,
        customClass: {
          popup: "sweet-popup2",
          actions: "sweet-actions"
        }
      });
    }
    else {
      if (this.selected.length == Number(this.count)) { title = 'Sure you want to delete all messages?'; }
      title = 'Sure you want to delete the selected messages?';
      Swal.fire({
        icon: 'question',
        title: title,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        showLoaderOnConfirm: true,
        customClass: {
          actions: "sweet-actions",
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.requestDelete.srcQueue = this.queue;
          this.requestDelete.messagesToDelete = this.selected;
          this.requestDelete.connection = this.queuesService.getParam();
          this.subscribers.push(this.queuesService.deleteMessages(this.requestDelete).subscribe(
            res => {
              this.getMessages();
              this.snackBar.open("messages deleted", "Done", {
                duration: 1000,
                panelClass: "Success"
              });
            }
          ));
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.stop();
    this.subscribers.forEach(s => s.unsubscribe());
    this.subscribers.splice(0);
    this.subscribers = [];
  }

}
