import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { QueuesService } from 'src/app/Core/Services/queues.service';
import { Connection } from '../../../Models/Connection.model';
import { requestMove } from '../../../Models/Requests.model';
import { QueueComponent } from '../queue.component';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss']
})
export class MoveComponent implements OnInit {
  subscribers: Subscription[] = [];
  vhosts: any = [];
  queues: any = [];

  moveForm = this.formBuilder.group({
    destQueue: ["", [Validators.required]],
    vhost: ["", [Validators.required]],
  });

  connection: Connection = {
    addressIp: "127.0.0.1",
    username: "guest",
    password: "guest",
  };

  requestMove: requestMove = {
    srcQueue: this.data.srcQueue,
    destQueue: {
      countMessage: 0,
      name: "",
      virtualHost: "",
      argomenti: null,
      autoDelete: false,
      durable: false,
      exclusive: false
    },
    messagesToMove: [],
    connection: this.connection
  }

  constructor(
    public dialogRef: MatDialogRef<QueueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private queuesService: QueuesService,
    private snackBar: MatSnackBar,
  ) { }

  closeDialog() {
    this.dialogRef.close(null);
  }

  getVhosts() {
    this.subscribers.push(this.queuesService.getVhosts().subscribe(
      res => this.vhosts = res
    ));
  }

  getQueues() {
    console.log("GET QUEUES");
    this.subscribers.push(this.queuesService.getAll().subscribe(
      res => {
        this.queues = [];
        res.forEach(queue => {
          if (queue.backing_queue_status.len == undefined || queue.backing_queue_status.len == null) { return; }
          var vhost = this.moveForm.get("vhost").value;
          if (vhost == "" || queue.vhost == vhost) { this.queues.push(queue); }
        });
        this.queuesService.isAuthenticated("true");
      },
      err => {
        this.queuesService.isAuthenticated("false");
        this.queues = [];
      }
    ));
  }

  setVhost(vhost: string) {
    this.moveForm.get("vhost")?.setValue(vhost);
  }

  onSubmit() {
    if (this.moveForm.invalid) { return; }
    console.log("1 destQueue: ");
    console.log(this.moveForm.get("destQueue")?.value);
    console.log("2 vhost: ");
    console.log(this.moveForm.get("vhost")?.value);
    this.queues.forEach(queue => {
      if (this.moveForm.get("destQueue")?.value == queue.name && this.moveForm.get("vhost")?.value == queue.vhost) {
        console.log("3");
        console.log(queue);
        this.requestMove.destQueue.name = queue.name;
        this.requestMove.destQueue.countMessage = queue.backing_queue_status.len;
        this.requestMove.destQueue.virtualHost = queue.vhost;
        this.requestMove.destQueue.durable = queue.durable;
        this.requestMove.destQueue.exclusive = queue.exclusive;
        this.requestMove.destQueue.autoDelete = queue.auto_delete;
        this.requestMove.destQueue.argomenti = queue.arguments;
      }
    });
    console.log("4");
    console.log(this.requestMove.destQueue.argomenti);
    this.requestMove.srcQueue = this.data.srcQueue;
    this.requestMove.messagesToMove = this.data.messages;
    this.requestMove.connection = this.queuesService.getParam();
    this.subscribers.push(this.queuesService.moveMessages(this.requestMove).subscribe(
      res => {
        this.snackBar.open("messages moved", "Done", {
          duration: 1000,
          panelClass: "Success"
        });
        this.closeDialog();
      }
    ))
  }

  ngOnInit(): void {
    this.getVhosts();
    this.getQueues();
  }

}
