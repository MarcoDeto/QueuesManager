using i4QueuesManager.BL.Model;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace i4QueuesManager.BL
{
    public class QueueService : IQueueService
    {
        public Response<List<MessageDTO>> GetMessages(int skip, int take, GetRequest request)
        {
            var MessageList = new List<MessageDTO>();
            var factory = new ConnectionFactory() {
                AutomaticRecoveryEnabled = true,
                HostName = request.Connection.AddressIp, 
                UserName = request.Connection.Username,
                Password = request.Connection.Password,
                VirtualHost = request.Queue.VirtualHost,
            };

            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    try
                    {
                        IDictionary<string, object> _arguments = new Dictionary<string, object>();
                        foreach (var item in request.Queue.Argomenti)
                        {
                            var value = JsonSerializer.Serialize<object>(item.Value);
                            if (long.TryParse(value, out long Long))
                                _arguments.Add(item.Key, Long);
                            else if (int.TryParse(value, out int Int))
                                _arguments.Add(item.Key, Int);
                            else
                            {
                                value = Regex.Replace(value, @"[^\w\.@-]", "", RegexOptions.None, TimeSpan.FromSeconds(1.5));
                                _arguments.Add(item.Key, value);
                            }
                        }

                        channel.QueueDeclare(queue: request.Queue.Name,
                                             durable: request.Queue.Durable,
                                             exclusive: request.Queue.Exclusive,
                                             autoDelete: request.Queue.AutoDelete,
                                             arguments: _arguments);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                    for (var i = 0; i < request.Queue.CountMessage; i++)
                    {
                        if (MessageList.Count == take) { return new Response<List<MessageDTO>>(MessageList, request.Queue.CountMessage, HttpStatusCode.OK, null); }
                        BasicGetResult result = channel.BasicGet(request.Queue.Name, false);
                        if (result == null) { continue; }

                        var body = result.Body;
                        var message = Encoding.UTF8.GetString(body.ToArray());
                        if (i >= skip && i < (take+skip))
                        {
                            MessageList.Add(new MessageDTO(result.BasicProperties.MessageId, result.DeliveryTag, result.Exchange, result.MessageCount,
                                result.Redelivered, result.RoutingKey, message.ToString()));
                        }
                    }
                }
            }
            return new Response<List<MessageDTO>>(MessageList, request.Queue.CountMessage, HttpStatusCode.OK, null);
        }

        public void SendMessage(SendRequest request)
        {
            var factory = new ConnectionFactory()
            {
                AutomaticRecoveryEnabled = true,
                HostName = request.Connection.AddressIp,
                UserName = request.Connection.Username,
                Password = request.Connection.Password,
                VirtualHost = "I4IOTGateway"
            }; 
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    var headers = channel.CreateBasicProperties();

                    IDictionary<string, object> _arguments = new Dictionary<string, object>();
                    foreach (var item in request.DestQueue.Argomenti)
                    {
                        var value = JsonSerializer.Serialize<object>(item.Value);
                        if (long.TryParse(value, out long Long))
                            _arguments.Add(item.Key, Long);
                        else if (int.TryParse(value, out int Int))
                            _arguments.Add(item.Key, Int);
                        else
                        {
                            value = Regex.Replace(value, @"[^\w\.@-]", "", RegexOptions.None, TimeSpan.FromSeconds(1.5));
                            _arguments.Add(item.Key, value);
                        }
                    }

                    channel.QueueDeclare(queue: "hello",
                                         durable: true,
                                         exclusive: false,
                                         autoDelete: false,
                                         arguments: _arguments);

                    for (int i = 1; i < 11; i++)
                    {
                        headers.MessageId = Guid.NewGuid().ToString();
                        string message = $"SEND {i}!";
                        var body = Encoding.UTF8.GetBytes(message);

                        channel.BasicPublish(exchange: "",
                                             routingKey: "hello",
                                             basicProperties: headers,
                                             body: body);
                        Console.WriteLine(" [x] Sent {0}", message);
                    }
                }
            }
        }

        public void PurgeQueues(PurgeRequest request)
        {
            var vhosts = request.Queues.Select(x => x.Name).ToList();

            foreach (var vhost in vhosts)
            {
                var factory = new ConnectionFactory()
                {
                    AutomaticRecoveryEnabled = true,
                    HostName = request.Connection.AddressIp,
                    UserName = request.Connection.Username,
                    Password = request.Connection.Password,
                    VirtualHost = vhost
                };
                using (var connection = factory.CreateConnection())
                {
                    using (var channel = connection.CreateModel())
                    {
                        var queues = request.Queues.Where(x => x.VirtualHost == vhost);
                        foreach (var queue in queues)
                        {
                            Dictionary<string, object> _arguments = new Dictionary<string, object>();
                            foreach (var item in queue.Argomenti)
                                _arguments.Add(item.Key, item.Value);

                            channel.QueueDeclare(queue: queue.Name,
                                             durable: queue.Durable,
                                             exclusive: queue.Exclusive,
                                             autoDelete: queue.AutoDelete,
                                             arguments: _arguments);

                            var consumer = new EventingBasicConsumer(channel);
                            consumer.Received += (model, ea) => { };

                            channel.BasicConsume(queue: queue.Name,
                                                 autoAck: true,
                                                 consumer: consumer);
                        }
                    }
                }
            }
        }

        public void MoveMessages(MoveRequest request)
        {
            SendMessages(new SendRequest(request.DestQueue, request.MessagesToMove, request.Connection));
            DeleteMessages(new DeleteRequest(request.SrcQueue, request.MessagesToMove, request.Connection));
        }

        public void DeleteMessages(DeleteRequest request)
        {
            var factory = new ConnectionFactory()
            {
                AutomaticRecoveryEnabled = true,
                HostName = request.Connection.AddressIp,
                UserName = request.Connection.Username,
                Password = request.Connection.Password,
                VirtualHost = request.SrcQueue.VirtualHost
            };
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    IDictionary<string, object> _arguments = new Dictionary<string, object>();
                    foreach (var item in request.SrcQueue.Argomenti)
                    {
                        var value = JsonSerializer.Serialize<object>(item.Value);
                        if (long.TryParse(value, out long Long))
                            _arguments.Add(item.Key, Long);
                        else if (int.TryParse(value, out int Int))
                            _arguments.Add(item.Key, Int);
                        else
                        {
                            value = Regex.Replace(value, @"[^\w\.@-]", "", RegexOptions.None, TimeSpan.FromSeconds(1.5));
                            _arguments.Add(item.Key, value);
                        }
                    }

                    channel.QueueDeclare(queue: request.SrcQueue.Name,
                                         durable: request.SrcQueue.Durable,
                                         exclusive: request.SrcQueue.Exclusive,
                                         autoDelete: request.SrcQueue.AutoDelete,
                                         arguments: _arguments);

                    for (var i = 0; i < request.SrcQueue.CountMessage; i++)
                    {
                        BasicGetResult result = channel.BasicGet(request.SrcQueue.Name, false);
                        if (result == null) { break; }

                        if (request.MessagesToDelete.Any(x => x.MessageId == result.BasicProperties.MessageId))
                            channel.BasicAck(result.DeliveryTag, false);
                    }
                }
            }
        }

        public void SendMessages(SendRequest request)
        {
            var factory = new ConnectionFactory()
            {
                AutomaticRecoveryEnabled = true,
                HostName = request.Connection.AddressIp,
                UserName = request.Connection.Username,
                Password = request.Connection.Password,
                VirtualHost = request.DestQueue.VirtualHost,
            };
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    var headers = channel.CreateBasicProperties();

                    try
                    {
                        IDictionary<string, object> _arguments = new Dictionary<string, object>();
                        foreach (var item in request.DestQueue.Argomenti)
                        {
                            var value = JsonSerializer.Serialize<object>(item.Value);
                            if (long.TryParse(value, out long Long))
                                _arguments.Add(item.Key, Long);
                            else if (int.TryParse(value, out int Int))
                                _arguments.Add(item.Key, Int);
                            else
                            {
                                value = Regex.Replace(value, @"[^\w\.@-]", "", RegexOptions.None, TimeSpan.FromSeconds(1.5));
                                _arguments.Add(item.Key, value);
                            }
                        }

                        channel.QueueDeclare(queue: request.DestQueue.Name,
                                             durable: request.DestQueue.Durable,
                                             exclusive: request.DestQueue.Exclusive,
                                             autoDelete: request.DestQueue.AutoDelete,
                                             arguments: _arguments);

                        foreach (var message in request.MessagesToSend)
                        {
                            headers.MessageId = message.MessageId;
                            var body = Encoding.UTF8.GetBytes(message.Message);
                            channel.BasicPublish(exchange: "",
                                                 routingKey: request.DestQueue.Name,
                                                 basicProperties: headers,
                                                 body: body);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                }
            }
        }
    }
}
