using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ReVision.JSForms
{
    public class Application
    {
        public static Application Current;
        private WebSocket ws;

        private Form Root;

        public Dictionary<string, Control> Controls = new Dictionary<string, Control>();

        public Application()
        {
            Application.Current = this;
            var path = string.Empty;

            if (Window.Location.PathName != null)
            {
                path = Window.Location.PathName.Substring(0, Window.Location.PathName.IndexOf('/', 1));
                if (Window.Location.Port.Length > 1)
                {
                    path = ":" + Window.Location.Port + path;
                }
            }
            else
            {
                path = "ws://localhost:56357/echo";
            }

            var data = string.Empty;

            if(Window.SessionStorage != null)
            {
                data = Window.SessionStorage.GetItem("sessionId") as string;
                if (data == null)
                {
                    data = Guid.NewGuid();
                    Window.SessionStorage.SetItem("sessionId", data);
                }
            }
            else
            {
                data = Guid.NewGuid();
            }

            ws = new WebSocket(path + "?id=" + data);
            ws.OnOpen += OnSocketOpen;
            ws.OnMessage += OnMessage;
            ws.OnClose += OnClose;
            ws.OnError += OnError;
        }

        private void OnError(Event arg)
        {
            Window.Alert("Error");
        }

        private void OnClose(CloseEvent arg)
        {
            
        }

        private void OnMessage(MessageEvent arg)
        {
            var evt = JSON.Parse<WSEventArgs>(arg.Data.ToString());
            switch (evt.EventType)
            {
                case "MessageBox":
                    Window.Alert(evt.Value.ToString());
                    break;
                case "PropertyChanged":
                case "addListViewItem":
                case "addListItem":
                case "removeListViewItem":
                case "removeListItem":
                case "addListViewColumn":
                case "removeListViewColumn":
                case "clearList":
                    //onChangeProperty(obj);
                    break;
                case "removeControl":
                    //var windowDiv = document.getElementById('WI_' + obj.ClientId);
                    //if (windowDiv != undefined)
                    //    $(windowDiv).remove();
                    //var ctrl = document.getElementById('WU_' + obj.ClientId);
                    //if (ctrl != undefined)
                    //    $(ctrl).remove();
                    break;
                case "addControl":
                    //onAddControl(obj);
                    break;
                case "FormCreate":
                    Form form = JSON.Parse<Form>(JSON.Stringify(evt.Value));
                    form.ClientId = evt.ClientId;
                    var parent = form.Parent;
                    if (parent == null)
                    {
                        if (Root == null)
                        {
                            Root = form;
                        }
                        Window.OnResize = OnResize;
                        Document.Title = form.Text;
                        Document.Body.AppendChild(form.Element);
                    }
                    AddOrUpdate(form);
                    form.ShowDialog();
                    //createNewForm(obj.Value);
                    break;
                default:
                    Window.Alert("Unknown message type:" + evt.EventType);
                    break;
            }
        }

        private void OnResize(Event e = null)
        {
            Root.Element.InnerHTML = string.Empty;
            Root.ShowDialog();
        }

        private void AddOrUpdate(Control ctrl)
        {
            if (!string.IsNullOrEmpty(ctrl.ParentId) && Controls.ContainsKey(ctrl.ParentId))
            {
                ctrl.Parent = Controls[ctrl.ParentId];
            }

            if ( !Controls.ContainsKey(ctrl.ClientId) )
            {
                Controls.Add(ctrl.ClientId, ctrl);
            }
            else
            {
                Controls[ctrl.ClientId] = ctrl;
            }
        }

        private void OnSocketOpen(Event arg)
        {
            WSEventArgs args = new WSEventArgs();
            args.EventType = "openForm";

            this.Send(args);
        }

        public void Send(object o)
        {
            var msg = JSON.Stringify(o);
            this.ws.Send(msg);
        }
    }
}
