using Microsoft.AspNetCore.Mvc;
using i4QueuesManager.BL;
using i4QueuesManager.BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace i4QueuesManager.WEB.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QueuesController : ControllerBase
    {
        private readonly IQueueService _queueService;

        public QueuesController(IQueueService queueService)
        {
            _queueService = queueService;
        }
        [HttpPost]
        public QueueDTO Test(QueueDTO queue)
        {
            return queue;
        }

        [HttpPost]
        public Response<List<MessageDTO>> Get(GetRequest request, int skip = 0, int take = 10)
        {
            return _queueService.GetMessages(skip, take, request);
        }

        [HttpPost]
        public void Post(SendRequest request)
        {
            _queueService.SendMessage(request);
        }

        [HttpPut]
        public void Move(MoveRequest request)
        {
            _queueService.MoveMessages(request);
        }

        [HttpPut]
        public void Delete(DeleteRequest request)
        {
            _queueService.DeleteMessages(request);
        }

        [HttpPut]
        public void PurgeQueues(PurgeRequest request)
        {
            _queueService.PurgeQueues(request);
        }
    }
}
