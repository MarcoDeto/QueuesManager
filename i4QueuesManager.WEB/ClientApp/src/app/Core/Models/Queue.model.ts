export class QueueDTO {
  constructor(
    public name: string,
    public countMessage: number,
    public virtualHost: string,
    public durable: boolean,
    public exclusive: boolean,
    public autoDelete: boolean,
    public argomenti: any
  ) {}
}

export class Queue {
  constructor(
    public argument: any,
    public auto_delete: boolean,
    public backing_queue_status: Backing_Queue_Status,
      /*
      public consumer_utilisation: object,
      public durable: number,
      public flgVirtual: boolean,
      public effective_policy_definition: object[],
      public exclusive: boolean,
      public exclusive_consumer_tag: object,
      public garbage_collection: Garbage_Collection,
      public head_message_timestamp:	object,
      public idle_since: string,
      public memory: number,
      public message_bytes: number,
      public message_bytes_paged_out: number,
      public message_bytes_persistent:	number,
      public message_bytes_ram: number,
      public message_bytes_unacknowledged: number,
      */
    public messages: number,
    public messages_ready: number,
    public messages_unacknowledged: number,
      /*
      public messages_details:	Messages_Details,
      public messages_paged_out:	number,
      public messages_persistent: number,
      public messages_ram: number,
      public messages_ready: number,
      public messages_ready_details:	Messages_Ready_Details,
      public messages_ready_ram:	number,
      public messages_unacknowledged_details:	Messages_Unacknowledged_Details,
      public messages_unacknowledged_ram:	number,
      */
    public name: string,
      /*
      public node: string,
      public operator_policy: object,
      public policy: object,
      public recoverable_slaves: object,
      public reductions:	number,
      public reductions_details:	Reductions_Details,
      public state: string,
      */
    public vhost: string,
    public checked: boolean,
  ) {}
}


export class Argumenti
{
  constructor(
    public xmaxlengthbytes: number,
    public xmessagettl: number,
    public xoverflow: string
  ) {}
}

export class Backing_Queue_Status
{
  constructor(
    /*public avg_ack_egress_rate: number,
    public avg_ack_ingress_rate: number,
    public avg_egress_rate: number,
    public avg_ingress_rate: number,
    public delta: object[],*/
    public len: number,
    /*public mode: string,
    public next_seq_id: number,
    public q1: number,
    public q2: number,
    public q3: number,
    public q4: number,
    public target_ram_count: string,*/
  ) {}
}

export class Garbage_Collection
{
  constructor(
    public fullsweep_after: number,
    public max_heap_size: number,
    public min_bin_vheap_size: number,
    public min_heap_size: number,
    public minor_gcs: number,
  ) {}
}

export class Messages_Details
{
  constructor(
    public rate: number,
  ) {}
}

export class Messages_Ready_Details
{
  constructor(
    public rate: number,
  ) {}
}

export class Messages_Unacknowledged_Details
{
  constructor(
    public rate: number,
  ) {}
}

export class Reductions_Details
{
  constructor(
    public rate: number,
  ) {}
}
