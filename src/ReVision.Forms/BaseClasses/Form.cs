using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Drawing;
using System.Drawing.Design;
using System.Linq;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
//using System.Windows.Forms.Design;

namespace System.Windows.Forms
{
    [DesignerCategory("Form")]
    [Designer("System.Windows.Forms.Design.FormDocumentDesigner, System.Windows.Forms, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", typeof(IRootDesigner))]
    [DesignTimeVisible(false)]
    [DefaultEvent("Load")]
    [ClassInterface(ClassInterfaceType.AutoDispatch)]
    [InitializationEvent("Load")]
    [ComVisible(true)]
    [ToolboxItemFilter("System.Windows.Forms.Control.TopLevel")]
    [ToolboxItem(false)]
    [PermissionSetAttribute(SecurityAction.InheritanceDemand, Name = "FullTrust")]
    [PermissionSetAttribute(SecurityAction.LinkDemand, Name = "FullTrust")]
    public class Form : ContainerControl, IDisposable, IRootDesigner, IToolboxUser
    {
        public event EventHandler<FormClosedEventArgs> FormClosed;
        public FormWindowState WindowState = FormWindowState.Normal;
        public event EventHandler Load;
        //public bool IsHandledCreated { get; set; }

        public override string ControlName
        {
            get
            {
                return "Form";
            }
        }

        public async Task ShowDialog(Control parent = null)
        {
            this.IsHandleCreated = true;
            await FireEvent(new WSEventArgs()
            {
                ClientId = this.ClientId,
                EventType = "FormCreate",
                Value = this
            });

            if ( parent != null )
            {
                parent.AddForm(this);
            }
            else if( this.Parent != null )
            {
                this.Parent.AddForm(this);
            }
            else if( Application.Current != null)
            {
                if( Application.Current.RootForm != null)
                {
                    Application.Current.RootForm.AddForm(this);
                }
                else
                {
                    Application.Current.Forms.Add(this);
                }
            }
            //var str = JsonConvert.SerializeObject(this, Formatting.None, new JsonSerializerSettings
            //            {
            //                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            //            });
            //var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(str));
            //await Socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            Visible = true;
        }

        protected override async Task RaisePropertyChanged(string prop = "")
        {
            if( !this.IsHandleCreated )
            {
                return;
            }

            await base.RaisePropertyChanged(prop);
        }

        public event EventHandler<WSEventArgs> OnProcessMessage;

        public override async Task ProcessMessage(WSEventArgs args)
        {
            if (OnProcessMessage != null)
            {
                OnProcessMessage(this, args);
            }

            var clientId = GetId(args.ClientId);

            if (clientId == this.ClientId)
            {
                switch (args.EventType)
                {
                    case "FormClose":
                        {
                            if (this.FormClosed != null)
                            {
                                this.FormClosed(this, new FormClosedEventArgs());
                            }
                            Visible = false;
                        }
                        break;
                    case "WindowStateChange":
                        {
                            try
                            {
                                JObject frm = (JObject)args.Value;
                                this.Size = new System.Drawing.Size(frm.Value<int>("width"), frm.Value<int>("height"));
                                WindowState = (FormWindowState)Enum.Parse(typeof(FormWindowState), frm.Value<string>("state"), true);
                            }
                            catch { }
                            break;
                        }
                    case "Load":
                        {
                            if (this.Load != null)
                            {
                                this.Load(this, EventArgs.Empty);
                            }
                        }
                        break;
                }
            }
            await base.ProcessMessage(args);
        }

        public FormStartPosition StartPosition { get; set; }
        public System.Drawing.SizeF AutoScaleDimensions { get; set; }
        public System.Drawing.Size AutoScaleBaseSize { get; set; }
        public AutoScaleMode AutoScaleMode { get; set; }

        public System.Drawing.Size ClientSize { get; set; }

        public FormBorderStyle FormBorderStyle { get; set; }

        public bool MaximizeBox { get; set; }
        public bool MinimizeBox { get; set; }
        public bool ShowInTaskbar { get; set; }

        public Icon Icon { get; set; }

        public bool TopLevel { get; set; }

        public bool TopMost { get; set; }

        public Form Owner { get; set; }

        public void BringToFront()
        {
            
        }

        public void Close()
        {
            if( this.FormClosed != null )
            {
                this.FormClosed(this, new FormClosedEventArgs());
            }
            this.Visible = false;

            if (Application.Current != null)
            {
                Application.Current.Forms.Remove(this);
            }
        }

        public override void Dispose()
        {
            if( !this.IsDisposed )
            {
                Close();
            }

            base.Dispose();
        }

        public bool GetToolSupported(ToolboxItem tool)
        {
            return true;
        }

        public void ToolPicked(ToolboxItem tool)
        {
            
        }

        public object GetView(ViewTechnology technology)
        {
            return null;
        }

        public ViewTechnology[] SupportedTechnologies
        {
            get
            {
                return new ViewTechnology[] { ViewTechnology.Default };
            }
        }

        public new IComponent Component
        {
            get { return null; }
        }

        public void DoDefaultAction()
        {
           
        }

        public void Initialize(IComponent component)
        {
            
        }

        public DesignerVerbCollection Verbs
        {
            get { return null; }
        }
    }

    public enum FormWindowState
    {
        Normal,
        Minimized,
        Maximized
    }
}