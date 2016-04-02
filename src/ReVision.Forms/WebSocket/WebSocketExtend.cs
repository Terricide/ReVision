using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Net.WebSockets
{
    public static class WebSocketExtend
    {
        public static async Task SendAsync(this WebSocket socket, string msg)
        {
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg));
            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, Threading.CancellationToken.None);
        }

        public static async Task SendAsync(this WebSocket socket, object msg)
        {
            var str = JsonConvert.SerializeObject(msg, Formatting.None, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(str));
            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, Threading.CancellationToken.None);
        }
    }
}
