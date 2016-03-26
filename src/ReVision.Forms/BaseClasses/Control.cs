using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.ComponentModel.Design.Serialization;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Web;

namespace System.Windows.Forms
{
    [ComVisible(true)]
    [ClassInterface(ClassInterfaceType.AutoDispatch)]
    [DefaultProperty("Text")]
    [DefaultEvent("Click")]
    [ToolboxItemFilter("System.Windows.Forms")]
    public class Control : Component, IDisposable
    {
        public Control()
        {
            
        }

        void Controls_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ControlsChanged(e).Wait();
        }

        private async Task ControlsChanged(System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems.Cast<Control>())
                {
                    ctrl.Parent = this;

                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = ctrl.ClientId,
                        EventType = "addControl",
                        Value = JsonConvert.SerializeObject(ctrl, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        })
                    });
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems.Cast<Control>())
                {
                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = ctrl.ClientId,
                        EventType = "removeControl",
                    });
                }
            }
        }
        [BrowsableAttribute(false)]
        [JsonIgnore]
        public bool Disposing { get; private set; }
        [BrowsableAttribute(false)]
        [JsonIgnore]
        public bool IsDisposed { get; private set; }

        public override void Dispose()
        {
            this.IsDisposed = true;
        }
        protected virtual void Dispose(bool disposing)
        {
            this.Disposing = disposing;
        }

        private bool mIsHandledCreated;
        [JsonIgnore]
        public bool IsHandleCreated 
        { 
            get
            {
                if (!mIsHandledCreated)
                {
                    if( this.Parent != null )
                    {
                        return this.Parent.IsHandleCreated;
                    }
                }
                return mIsHandledCreated;
            }
            set
            {
                if( mIsHandledCreated != value )
                {
                    mIsHandledCreated = value;
                    if( HandleCreated != null )
                    {
                        HandleCreated(this, EventArgs.Empty);
                    }
                }
            }
        }
        [JsonConverter(typeof(ReVision.Forms.JsonConverters.ImageConverter))]
        public Image BackgroundImage { get; set; }
        public event EventHandler TextChanged;
        public event EventHandler HandleCreated;
        public int TabIndex { get; set; }
        public string Name { get; set; }
        public bool AutoSize { get; set; }
        [JsonConverter(typeof(ColorConverter))]
        public Color BackColor { get; set; }
        public Point Location { get; set; }
        private Size size = new Size(300, 300);
        public Size Size
        {
            get
            {
                return size;
            }
            set
            {
                if (size != value)
                {
                    size = value;
                    RaisePropertyChanged();
                }
            }
        }
        private bool mVisible = true;
        public bool Visible
        {
            get
            {
                return mVisible;
            }
            set
            {
                if (this.mVisible != value)
                {
                    this.mVisible = value;
                    RaisePropertyChanged();
                }
            }
        }
        [JsonConverter(typeof(ReVision.Forms.JsonConverters.HasEventConverter))]
        public bool hasClickEvent
        {
            get
            {
                if (this.Click == null)
                    return false;
                else
                    return true;
            }
        }
        public event EventHandler Click;
        public async void Focus()
        {
            await FireEvent(new WSEventArgs()
            {
                ClientId = this.ClientId,
                EventType = "focus",
            });
        }
        private string mText;
        public virtual string Text
        {
            get
            {
                return mText;
            }
            set
            {
                if (mText != value)
                {
                    mText = value;
                    RaisePropertyChanged();
                    if (TextChanged != null)
                    {
                        TextChanged(this, EventArgs.Empty);
                    }
                }
            }
        }
        private ControlsCollection mControls;
        public ControlsCollection Controls
        {
            get
            {
                if( mControls == null )
                {
                    mControls = new ControlsCollection(this);
                    mControls.CollectionChanged += Controls_CollectionChanged;
                }
                return mControls;
            }
        }

        protected string GetId(string id)
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
            return clientId;
        }

        public override async Task ProcessMessage(WSEventArgs args)
        {
            var id = GetId(args.ClientId);

            if (this.ClientId == id)
            {
                switch (args.EventType)
                {
                    case "click":
                        {
                            FirePublicEvent(this, "Click", new object[] { this, EventArgs.Empty });
                        }
                        break;
                    case "textchanged":
                        {
                            UpdateProperty(this, "Text", args.Value);
                        }
                        break;
                }
            }
            else
            {
                foreach (var ctrl in this.Controls.ToArray())
                {
                    await ctrl.ProcessMessage(args);
                }
            }
        }

        public void FirePublicEvent(object onMe, string invokeMe, params object[] eventParams)
        {
            var baseType = typeof(Control);// onMe.GetType().BaseType;

            var evt = baseType.GetField(invokeMe, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);

            MulticastDelegate eventDelagate = (MulticastDelegate)evt.GetValue(onMe);

            if (eventDelagate == null)
            {
                return;
            }

            Delegate[] delegates = eventDelagate.GetInvocationList();

            foreach (Delegate dlg in delegates)
            {
                dlg.Method.Invoke(dlg.Target, eventParams);
            }
        }

        public void UpdateProperty(object onMe, string invokeMe, object val)
        {
            var baseType = onMe.GetType().BaseType;

            var field = baseType.GetProperty(invokeMe, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);

            field.SetValue(this, val);
        }

        public override string ControlName
        {
            get
            {
                return "Control";
            }
        }

        public override async Task FireEvent(WSEventArgs evt)
        {
            if (this.Parent == null && this.ControlName != "Form" )
            {
                return;
            }

            if (this.Parent != null && !this.Parent.IsHandleCreated)
            {
                return;
            }
            else if (this.Parent == null && !this.IsHandleCreated && evt.EventType != "FormCreate")
            {
                return;
            }

            if (Application.Current != null && Application.Current.Socket != null)
            {
                this.Socket = Application.Current.Socket;
            }
            if (Socket != null)
            {
                await base.FireEvent(evt);
            }
            else if (Parent != null)
            {
                await Parent.FireEvent(evt);
            }
        }

        [JsonIgnore]
        public Control Parent { get; set; }

        public string ParentId
        {
            get
            {
                return Parent == null ? null : Parent.ClientId;
            }
        }

        private DockStyle mDock;
        public DockStyle Dock
        {
            get
            {
                return mDock;
            }
            set
            {
                if( mDock != value )
                {
                    mDock = value;
                    RaisePropertyChanged();
                }
            }
        }

        private ImageLayout mBackgroundImageLayout;
        public ImageLayout BackgroundImageLayout
        {
            get
            {
                return mBackgroundImageLayout;
            }
            set
            {
                if (mBackgroundImageLayout != value)
                {
                    mBackgroundImageLayout = value;
                    RaisePropertyChanged();
                }
            }
        }

        private BorderColor mBorderColor;
        public BorderColor BorderColor 
        {
            get
            {
                return mBorderColor;
            }
            set
            {
                if (mBorderColor != value)
                {
                    mBorderColor = value;
                    RaisePropertyChanged();
                }
            }
        }

        private bool mTabStop = true;
        public virtual bool TabStop
        {
            get
            {
                return mTabStop;
            }
            set
            {
                if (mTabStop != value)
                {
                    mEnabled = value;
                    RaisePropertyChanged();
                }
            }
        }

        private bool mEnabled = true;
        public bool Enabled 
        { 
            get
            {
                return mEnabled;
            }
            set
            {
                if( mEnabled != value )
                {
                    mEnabled = value;
                    RaisePropertyChanged();
                }
            }
        }

        public FlatStyle FlatStyle { get; set; }

        private Color mForeColor;
        [JsonConverter(typeof(ColorConverter))]
        public Color ForeColor
        {
            get
            {
                return mForeColor;
            }
            set
            {
                if (mForeColor != value)
                {
                    mForeColor = value;
                    RaisePropertyChanged();
                }
            }
        }

        private BorderStyle mBorderStyle;
        public BorderStyle BorderStyle
        {
            get
            {
                return mBorderStyle;
            }
            set
            {
                if (mBorderStyle != value)
                {
                    mBorderStyle = value;
                    RaisePropertyChanged();
                }
            }
        }

        private Font mFont;
        public Font Font
        {
            get
            {
                return mFont;
            }
            set
            {
                if (mFont != value)
                {
                    mFont = value;
                    RaisePropertyChanged();
                }
            }
        }

        private AnchorStyles mAnchor = AnchorStyles.Left | AnchorStyles.Top;
        public AnchorStyles Anchor
        {
            get
            {
                return mAnchor;
            }
            set
            {
                if (mAnchor != value)
                {
                    mAnchor = value;
                    RaisePropertyChanged();
                }
            }
        }

        public void SuspendLayout()
        {

        }

        public void ResumeLayout(bool isDone)
        {

        }

        public virtual void PerformLayout()
        {

        }

        public int Right
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.X + this.Size.Width;
            }
        }

        public int Bottom
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.Y + this.Size.Height;
            }
        }

        public int Top
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.Y;
            }
            set
            {
                this.Location = new Point(this.Top, value);
            }
        }

        public int Left
        {
            get
            {
                if (this.Parent == null)
                {
                    return -1;
                }
                return this.Location.X;
            }
            set
            {
                this.Location = new Point(value, this.Top);
            }
        }

        public int Width
        {
            get
            {
                return this.Size.Width;
            }
            set
            {
                this.Size = new Size(value, this.Height);
            }
        }

        public int Height
        {
            get
            {
                return this.Size.Height;
            }
            set
            {
                this.Size = new Size(this.Width, value);
            }
        }

        public Rectangle ClientRectangle
        {
            get
            {
                return new Rectangle(this.Location, this.size);
            }
        }

        public void Select()
        {
            //throw new NotImplementedException();
        }

        public Graphics CreateGraphics()
        {
            Graphics g = Graphics.FromImage(new Bitmap(this.Width, this.Height));
            return g;
        }

        public Padding Padding = new Padding();

        public event EventHandler<MouseEventArgs> MouseDown;
        public event EventHandler<MouseEventArgs> MouseMove;

        public void Hide()
        {
            this.Visible = false;
        }

        public event EventHandler AddFormEvent;
        internal void AddForm(Form form)
        {
            if( Parent != null )
            {
                Parent.AddForm(form);
            }

            if( AddFormEvent != null )
            {
                AddFormEvent(form, EventArgs.Empty);
            }
        }
    }
}