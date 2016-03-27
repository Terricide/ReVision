using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;

namespace System.Windows.Forms
{
    public class Application : MarshalByRefObject
    {
        public List<Form> Forms = new List<Form>();
        private ConcurrentDictionary<int, Component> Components = new ConcurrentDictionary<int, Component>();

        public static volatile Application Current;

        private int mNextId;
        private int NextId
        {
            get
            {
                return mNextId++;
            }
        }

        public Form RootForm;

        public async Task CreateDomain(Form frm, string id, WebSocket socket)
        {
            //var ads = new AppDomainSetup();
            //ads.ApplicationBase = Path.Combine(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, "bin");
            //ads.PrivateBinPath = Path.Combine(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, "bin");

            //var domain = AppDomain.CreateDomain(id, null, ads);
            instance = new Application();
            instance.Socket = socket;
            RootForm = frm;
            await instance.ShowDialog(frm);
        }

        public int AddComponent(Component c)
        {
            var id = NextId;
            Components.AddOrUpdate(id, c, (o,n) => c);
            return id;
        }

        public void RemoveComponent(Component c)
        {
            int id;
            Int32.TryParse(c.ClientId, out id);
            Component retVal;
            Components.TryRemove(id, out retVal);
        }

        public async Task UpdateDomain(string id, WebSocket socket)
        {
            //var ads = new AppDomainSetup();
            //ads.ApplicationBase = Path.Combine(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, "bin");
            //ads.PrivateBinPath = Path.Combine(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, "bin");

            //var domain = AppDomain.CreateDomain(id, null, ads);
            instance.Socket = socket;
            RootForm.IsHandleCreated = true;
            await instance.ShowDialog(RootForm);
        }

        void frm_AddFormEvent(object sender, EventArgs e)
        {
            Form frm = sender as Form;
            if( frm == null )
            {
                return;
            }
            Forms.Add(frm);
        }

        public async Task ProcessMessage(WSEventArgs command)
        {
            var id = GetId(command.ClientId);
            if (Components.ContainsKey(id))
            {
                await Components[id].ProcessMessage(command);
            }
            else
            {
                await instance.ProcessFormMessage(command);
            }
        }

        protected int GetId(string id)
        {
            var clientId = string.Empty;
            if (id.Split('_').Length > 1)
            {
                clientId = id.Split('_')[1];
            }
            else
            {
                clientId = id;
            }
            int retVal;
            if( Int32.TryParse(clientId, out retVal) )
            {
                return retVal;
            }
            throw new Exception("Unable to parse ClientId of " + clientId);
        }

        private async Task ProcessFormMessage(WSEventArgs command)
        {
            foreach (var frm in this.Forms.ToArray())
            {
                await frm.ProcessMessage(command);
            }
        }

        private async Task ShowDialog(Form frm)
        {
            frm.Socket = this.Socket;
            frm.AddFormEvent += frm_AddFormEvent;
            await frm.ShowDialog();
        }

        public WebSocket Socket { get; set; }

        public Application instance { get; set; }
    }
}