export class Message {
  constructor(
    public messageId: string,
    public message: string,
    public deliveryTag: number,
    public exchange: string,
    public messageCount: number,
    public redelivered: boolean,
    public routingKey: string,
    public checked: boolean
  ) {}
}
