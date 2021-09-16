import { Connection } from "./Connection.model";
import { Message } from "./Message.model";
import { QueueDTO } from "./Queue.model";

export class requestQueue {
  constructor(
    public xqueuetype: string,
    public auto_delete: string,
    public durable: string,
    public name: string,
    public vhost: string,
  ) { }
}

export class requestMessage {
  constructor(
    public queue: QueueDTO,
    public connection: Connection,
  ) {}
}

export class requestMove {
  constructor(
    public srcQueue: QueueDTO,
    public destQueue: QueueDTO,
    public messagesToMove: Message[],
    public connection: Connection,
  ) {}
}

export class requestDelete {
  constructor(
    public srcQueue: QueueDTO,
    public messagesToDelete: Message[],
    public connection: Connection,
  ) { }
}

export class requestPurge {
  constructor(
    public queues: QueueDTO[],
    public connection: Connection,
  ) { }
}
