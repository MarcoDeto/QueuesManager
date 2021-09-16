import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Connection } from "../Models/Connection.model";
import { Queue } from "../Models/Queue.model";
import { HttpHeaders } from '@angular/common/http';
import { Message } from '../Models/Message.model';
import { requestMessage, requestQueue, requestMove, requestDelete } from '../Models/Requests.model';
import { environment } from '../../../environments/environment';
import { Response } from "../Models/Response.model";

@Injectable({
  providedIn: 'root'
})

export class QueuesService {

  private _addressIp: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public addressIp: Observable<string> = this._addressIp.asObservable();

  private _username: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public username: Observable<string> = this._username.asObservable();

  private _password: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public password: Observable<string> = this._password.asObservable();

  /*private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsAuthenticated: Observable<boolean> = this.isAuthenticated.asObservable();*/

  constructor(
    private http: HttpClient
  ) { }

  isAuthenticated(value: string) { localStorage.setItem('isAuthenticated', value); }

  setSession(param: Connection) {
    /*
    this._addressIp.next(param.addressIp);
    this._username.next(param.username);
    this._password.next(param.password);
    */
    localStorage.setItem('addressIp', param.addressIp);
    localStorage.setItem('username', param.username);
    localStorage.setItem('password', param.password);
    this.isAuthenticated("false");
  }

  setVhost(virtualHost: string) { localStorage.setItem('virtualHost', virtualHost);}

  getAddressIp() { return localStorage.getItem("addressIp")!; }
  getusername() { return localStorage.getItem("username")!; }
  getPassword() { return localStorage.getItem("password")!; }
  getVirtualHost() { return localStorage.getItem("virtualHost")!; }
  getIsAuthenticated() { return localStorage.getItem("isAuthenticated")!; }

  getParam(): Connection {
    var param: Connection = {
      addressIp: this.getAddressIp(),
      username: this.getusername(),
      password: this.getPassword()
    }
    /*
    this.addressIp.subscribe((x : string) => param.addressIp = x);
    this.username.subscribe((x : string) => param.username = x);
    this.password.subscribe((x : string) => param.password = x);
    */
    return param;
  }

  getAuth(username: string, password: string) {
    return 'Basic ' + btoa(username + ':' + password);
  }

  connection(conn: Connection): Observable<any> {
    const headerOptions = {
      headers: new HttpHeaders({
        'Authorization': this.getAuth(conn.username, conn.password),
      })
    };
    return this.http.get<any>("http://" + conn.addressIp + ":15672/api/whoami", headerOptions);
  }

  getAll(): Observable<any> {
    var param = this.getParam();
    const headerOptions = {
      headers: new HttpHeaders({
        'Authorization': this.getAuth(param.username, param.password),
      })
    };
    return this.http.get<any>("http://" + param.addressIp + ":15672/api/queues", headerOptions);
  }

  getVhosts(): Observable<any> {
    var param = this.getParam();
    const headerOptions = {
      headers: new HttpHeaders({
        'Authorization': this.getAuth(param.username, param.password),
      })
    };
    return this.http.get<any>("http://" + param.addressIp + ":15672/api/vhosts", headerOptions);
  }

  getMessages(request: requestMessage, skip: number, take: number): Observable<Response> {
    return this.http.post<Response>(environment.Queue + "/Get?skip=" + skip + "&take=" + take, request);
  }

  moveMessages(request: requestMove) {
    return this.http.put<Response>(environment.Queue + "/Move", request);
  }

  deleteMessages(request: requestDelete) {
    return this.http.put<Response>(environment.Queue + "/Delete", request);
  }

  addQueue(request: requestQueue) {
    var param = this.getParam();
    const headerOptions = {
      headers: new HttpHeaders({
        'Authorization': this.getAuth(param.username, param.password),
      })
    };
    return this.http.put("http://" + param.addressIp + ":15672/api/queues/%2F/" + request.name, request, headerOptions);
  }

  purgeQueues(queues: string[]) {
    var addressIp = this.getAddressIp();
    return this.http.put<Response>(environment.Queue + "/PurgeQueue?addressIp=" + addressIp, queues);
  }
  /*
  purgeQueue(queueName: string) {
    var param = this.getParam();
    const headerOptions = {
      headers: new HttpHeaders({
          'Authorization': this.getAuth(param.username, param.password),
      })
    };
    return this.http.delete("http:" + param.addressIp + ":15672/api/queues/%2F/" + queueName + "/contents", headerOptions);
  }*/

  deleteQueue(queueName: string, vhost: string) {
    var param = this.getParam();
    if (vhost == "/") vhost = "%2F";

    const headerOptions = {
      headers: new HttpHeaders({
        'Authorization': this.getAuth(param.username, param.password),
      }),
      body: {
        mode: "delete",
        name: queueName,
        vhost: vhost
      }
    };
    return this.http.delete("http://" + param.addressIp + ":15672/api/queues/" + vhost + "/" + queueName, headerOptions);
  }

  test(queue: any) {
    return this.http.post(environment.Queue + "/Test", queue);
  }
}
