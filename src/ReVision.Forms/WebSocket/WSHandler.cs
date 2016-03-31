using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.SessionState;
using System.Web.WebSockets;
using System.Windows.Forms;

namespace ReVision.Forms
{
    public class WSHandler : IHttpHandler, IRequiresSessionState 
    {
        public static Dictionary<string, Application> Apps = new Dictionary<string, Application>();

        private string SessionId { get; set; }

        public void ProcessRequest(HttpContext context)
        {
            this.SessionId = context.Request.Params["id"];
            if (context.IsWebSocketRequest)
            {
                context.AcceptWebSocketRequest(ProcessWSChat);
            }
        }

        public bool IsReusable { get { return false; } }

        private async Task ProcessWSChat(AspNetWebSocketContext context)
        {
            try
            {
                WebSocket socket = context.WebSocket;

                Application App = null;
                bool isNew = true;
                if( !Apps.ContainsKey(SessionId))
                {
                    App = new Application();
                    Apps.Add(SessionId, App);
                }
                else
                {
                    isNew = false;
                    App = Apps[SessionId]; 
                }

                Application.Current.Value = App;
                App.Socket = socket;

                while (true)
                {
                    try
                    {
                        ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
                        WebSocketReceiveResult result = await socket.ReceiveAsync(
                            buffer, CancellationToken.None);
                        if (socket.State == WebSocketState.Open)
                        {
                            string userMessage = Encoding.UTF8.GetString(
                                buffer.Array, 0, result.Count);

                            var command = JsonConvert.DeserializeObject<WSEventArgs>(userMessage);

                            if (command.EventType == "openForm")
                            {

                                if (isNew)
                                {
                                    var formInfo = WebConfigurationManager.AppSettings["Form"];
                                    var type = Type.GetType(formInfo);
                                    var form = (Form)Activator.CreateInstance(type);
                                    await App.CreateDomain(form, SessionId, socket);
                                }
                                else
                                {
                                    await App.UpdateDomain(SessionId, socket);
                                }
                            }
                            else
                            {
                                await App.ProcessMessage(command);
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    catch(Exception ex)
                    {
                        if (socket.State == WebSocketState.Open)
                        {
                            await socket.SendAsync(ex);
                            continue;
                        }
                        throw;
                    }                    
                }
            }
            catch 
            {
                throw;
            }
        }

        private async Task SendException(WebSocket socket, Exception ex)
        {
            if (socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(ex);                
            }
        }

    }
}