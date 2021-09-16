using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace i4QueuesManager.BL.Model
{
    public class QueueDTO
    {
        public string Name { get; set; }
        public int CountMessage { get; set; }
        public string VirtualHost { get; set; }
        public bool Durable { get; set; }
        public bool Exclusive { get; set; }
        public bool AutoDelete { get; set; }
        public Dictionary<string, object>? Argomenti { get; set; }

        public QueueDTO(string name, int countMessage, string virtualHost, bool durable, bool exclusive, bool autodelete, Dictionary<string, object>? argomenti)
        {
            Name = name;
            CountMessage = countMessage;
            VirtualHost = virtualHost;
            Durable = durable;
            Exclusive = exclusive;
            AutoDelete = autodelete;
            Argomenti = argomenti;
        }
    }
}
