using i4QueuesManager.BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace i4QueuesManager.BL
{
    public interface IQueueService
    {
        Response<List<MessageDTO>> GetMessages(int skip, int take, GetRequest request);
        void SendMessage(SendRequest request);
        void PurgeQueues(PurgeRequest request);
        void MoveMessages(MoveRequest request);
        void DeleteMessages(DeleteRequest request);
    }
}
