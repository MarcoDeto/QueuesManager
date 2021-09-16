using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace i4QueuesManager.BL.Model
{
    public class GetRequest
    {
        public QueueDTO Queue { get; set; }
        public Connection Connection { get; set; }

        public GetRequest(QueueDTO queue, Connection connection)
        {
            Queue = queue;
            Connection = connection;
        }
    }

    public class SendRequest
    {
        public QueueDTO DestQueue { get; set; }
        public List<MessageDTO> MessagesToSend { get; set; }
        public Connection Connection { get; set; }

        public SendRequest(QueueDTO destQueue, List<MessageDTO> messagesToSend, Connection connection)
        {
            DestQueue = destQueue;
            MessagesToSend = messagesToSend;
            Connection = connection;
        }
    }

    public class MoveRequest
    {
        public QueueDTO SrcQueue { get; set; }
        public QueueDTO DestQueue { get; set; }
        public List<MessageDTO> MessagesToMove { get; set; }
        public Connection Connection { get; set; }

        public MoveRequest(QueueDTO srcQueue, QueueDTO destQueue, List<MessageDTO> messagesToMove, Connection connection)
        {
            SrcQueue = srcQueue;
            DestQueue = destQueue;
            MessagesToMove = messagesToMove;
            Connection = connection;
        }
    }

    public class DeleteRequest
    {
        public QueueDTO SrcQueue { get; set; }
        public List<MessageDTO> MessagesToDelete { get; set; }
        public Connection Connection { get; set; }

        public DeleteRequest(QueueDTO srcQueue, List<MessageDTO> messagesToDelete, Connection connection)
        {
            SrcQueue = srcQueue;
            MessagesToDelete = messagesToDelete;
            Connection = connection;
        }
    }

    public class PurgeRequest
    {
        public List<QueueDTO> Queues { get; set; }
        public Connection Connection { get; set; }

        public PurgeRequest(List<QueueDTO> queues, Connection connection)
        {
            Queues = queues;
            Connection = connection;
        }
    }
}
