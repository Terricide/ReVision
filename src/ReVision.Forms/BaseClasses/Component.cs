using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.ComponentModel.Design;
using System.Runtime.InteropServices;
using System.IO;
using System.Drawing.Imaging;
using System.Reflection;
using Newtonsoft.Json.Serialization;

namespace System.Windows.Forms
{
    [DesignerCategory ("Component")]
	[ComVisible (true)]
	[ClassInterface (ClassInterfaceType.AutoDispatch)]
    public partial class Component : IComponent, IDisposable, IObservableItem, INotifyPropertyChanged
    {
        private Application Current;
        private EventHandlerList event_handlers;
        private ISite mySite;
        private object disposedEvent = new object();
        public Component()
        {
            event_handlers = null;
        }
        ~Component()
        {
            Dispose(false);
        }

        public virtual string ControlName
        {
            get
            {
                return "Component";
            }
        }

        private string mClientId;
        public string ClientId
        {
            get
            {
                if (string.IsNullOrEmpty(mClientId))
                {
                    Current = Application.Current.Value;
                    mClientId = Current.AddComponent(this).ToString();
                }
                return mClientId;
            }
            set
            {
                if (mClientId != value)
                {
                    mClientId = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string[] AllEvents
        {
            get
            {
                var type = this.GetType();

                var list = new List<string>();
                do
                {

                    foreach (var field in type.GetFields(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | Reflection.BindingFlags.Public))
                    {
                        MulticastDelegate eventDelagate = field.GetValue(this) as MulticastDelegate;

                        if (eventDelagate != null)
                        {
                            string name = string.Empty;
                            var split = field.Name.Split(new char[] { '<', '>' });
                            if( split.Length == 1)
                            {
                                name = split[0];
                            }
                            else
                            {
                                name = split[1];
                            }
                            list.Add(name);field.Name.Contains("Link");
                        }
                    }
                    type = type.BaseType;
                }
                while (type != null);

                return list.ToArray();
            }
        }

        public virtual async Task ProcessMessage(WSEventArgs args)
        {
            
        }

        [JsonIgnore]
        public WebSocket Socket
        {
            get
            {
                if( Current == null )
                {
                    return null;
                }
                return Current.Socket;
            }
        }

        [JsonIgnore]
        public WebSocketState State
        {
            get
            {
                try
                {
                    if( this.Socket == null )
                    {
                        return WebSocketState.Closed;
                    }

                    return this.Socket.State;
                }
                catch(ObjectDisposedException)
                {
                    return this.Socket.State;
                }
            }
        }

        private Queue<WSEventArgs> EventQueue = new Queue<WSEventArgs>();

        public virtual async Task FireEvent(WSEventArgs evt)
        {
            try
            {
                if (this.State == WebSocketState.Open)
                {
                    string str = string.Empty;
                    ArraySegment<byte> buffer;
                    while (EventQueue.Count > 0)
                    {
                        var queuedEvent = EventQueue.Dequeue();
                        if (queuedEvent == null)
                        {
                            continue;
                        }
                        str = JsonConvert.SerializeObject(queuedEvent, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                            ContractResolver = new CamelCasePropertyNamesContractResolver()
                        });
                        if (string.IsNullOrEmpty(str))
                        {
                            continue;
                        }
                        buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(str));
                        await Socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                    }

                    str = JsonConvert.SerializeObject(evt, new JsonSerializerSettings()
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    });
                    buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(str));
                    await Socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                }
                else
                {
                    EventQueue.Enqueue(evt);
                }
            }
            catch (InvalidOperationException)
            {
                EventQueue.Enqueue(evt);
            }
            catch (Exception)
            {
                EventQueue.Enqueue(evt);
                throw;
            }
        }

        public event ObservableItemPropertyChangedHandler ObservableItemPropertyChanged;

        protected static Dictionary<Type, Dictionary<string, PropertyInfo>> mComponentProperties = new Dictionary<Type,Dictionary<string,PropertyInfo>>(50);
        protected static string mBitmapTypeFullName = typeof(Bitmap).FullName;

        protected virtual async Task RaisePropertyChanged([CallerMemberName]string propName = "")
        {           
            Type thisType = this.GetType();
            if (!mComponentProperties.ContainsKey(thisType))
            {
                //Lazy load the properties for the component's Type and store them for future use
                PropertyInfo[] properties = thisType.GetProperties();
                Dictionary<string, PropertyInfo> thisProperties = new Dictionary<string, PropertyInfo>(properties.Length);
                                
                foreach (PropertyInfo pi in properties)
                {
                    thisProperties.Add(pi.Name, pi);
                }
                mComponentProperties.Add(thisType, thisProperties);
            }
            var prop = mComponentProperties[thisType][propName];
            var val = prop.GetValue(this);
            if (val != null && val.ToString() == mBitmapTypeFullName)
            {
                using (var ms = new MemoryStream())
                {
                    Image img = val as Image;
                    img.Save(ms, ImageFormat.Png);
                    val = Convert.ToBase64String(ms.ToArray());
                }
            }
            await RaisePropertyChanged(propName, val);
        }

        [Browsable(false), EditorBrowsable(EditorBrowsableState.Advanced)]
        public event EventHandler Disposed
        {
            add { Events.AddHandler(disposedEvent, value); }
            remove { Events.RemoveHandler(disposedEvent, value); }
        }

        public virtual void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool release_all)
        {
            if (release_all)
            {
                if (mySite != null && mySite.Container != null)
                    mySite.Container.Remove(this);
                EventHandler eh = (EventHandler)Events[disposedEvent];
                if (eh != null)
                    eh(this, EventArgs.Empty);
            }

            if (Current != null)
            {
                Current.RemoveComponent(this);
            }
        }

        protected EventHandlerList Events
        {
            get
            {
                // Note: space vs. time tradeoff
                // We create the object here if it's never be accessed before.  This potentially 
                // saves space. However, we must check each time the propery is accessed to
                // determine whether we need to create the object, which increases overhead.
                // We could put the creation in the contructor, but that would waste space
                // if it were never used.  However, accessing this property would be faster.
                if (null == event_handlers)
                    event_handlers = new EventHandlerList();

                return event_handlers;
            }
        }

        [Browsable(false), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual ISite Site
        {
            get { return mySite; }
            set { mySite = value; }
        }

        [Browsable(false), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public IContainer Container
        {
            get
            {
                if (mySite == null)
                    return null;
                return mySite.Container;
            }
        }

        [Browsable(false), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        protected bool DesignMode
        {
            get
            {
                if (mySite == null)
                    return false;
                return mySite.DesignMode;
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual async Task RaisePropertyChanged(string propName, object val)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propName));

            await FireEvent(new WSEventArgs()
            {
                ClientId = this.ClientId,
                EventType = "PropertyChanged",
                Value = new
                {
                    Name = propName,
                    Value = val
                }
            });
        }

        public object Tag { get; set; }
    }    
}