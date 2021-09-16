using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace i4QueuesManager.BL.Model
{
    public class Connection
    {
        public string AddressIp { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public Connection(string addressIp, string username, string password)
        {
            AddressIp = addressIp;
            Username = username;
            Password = password;
        }
    }
}
