using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace i4QueuesManager.BL.Model
{
    public class MessageDTO
    {
        public string MessageId { get; set; }
        public string Message { get; set; }
        // Riepilogo:
        //     Retrieve the delivery tag for this message. See also RabbitMQ.Client.IModel.BasicAck(System.UInt64,System.Boolean).
        public ulong DeliveryTag { get; set; }
        //
        // Riepilogo:
        //     Retrieve the exchange this message was published to.
        public string Exchange { get; set; }
        //
        // Riepilogo:
        //     Retrieve the number of messages pending on the queue, excluding the message being
        //     delivered.
        //
        // Commenti:
        //     Note that this figure is indicative, not reliable, and can change arbitrarily
        //     as messages are added to the queue and removed by other clients.
        public uint MessageCount { get; set; }
        //
        // Riepilogo:
        //     Retrieve the redelivered flag for this message.
        public bool Redelivered { get; set; }
        //
        // Riepilogo:
        //     Retrieve the routing key with which this message was published.
        public string RoutingKey { get; set; }

        public MessageDTO(string messageId, ulong deliveryTag, string exchange, uint messageCount, bool redelivered, string routingKey, string message)
        {
            MessageId = messageId;
            Message = message;
            DeliveryTag = deliveryTag;
            Exchange = exchange;
            MessageCount = messageCount;
            Redelivered = redelivered;
            RoutingKey = routingKey;
        }
    }
}
