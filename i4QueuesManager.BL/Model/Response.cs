using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace i4QueuesManager.BL.Model
{
    public class Response<T>
    {
        public Response(T content, int count, HttpStatusCode code, string errorMessage)
        {
            Content = content;
            Count = count;
            Code = code;
            ErrorMessage = errorMessage;
        }

        public Response()
        {
            this.Content = default(T);
        }
        public T Content { get; set; }
        public int Count { get; set; }
        public HttpStatusCode Code { get; set; }
        public string ErrorMessage { get; set; }
    }
}
