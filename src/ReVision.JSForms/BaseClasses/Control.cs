using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Control : Component
    {
        public Bridge.Html5.DivElement Element = new Bridge.Html5.DivElement();
        public Bridge.Html5.SpanElement LabelElement = new SpanElement();
        public Control Parent { get; set; }
        public string ParentId { get; set; }

        public string BackgroundImage { get; set; }

        private string mBackColor;
        public virtual string BackColor
        {
            get
            {
                return mBackColor;
            }
            set
            {
                if (mBackColor != value)
                {
                    mBackColor = value;
                    this.Element.Style.BackgroundColor = value;
                    RaisePropertyChanged("BackColor", value);
                }
            }
        }

        public ControlsCollection Controls { get; set; }

        private void Controls_CollectionChanged(object sender, Collections.Specialized.NotifyCollectionChangedEventArgs<Control> e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems)
                {
                    ctrl.Parent = this;
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems)
                {

                }
            }
        }

        public void Render()
        {
            this.Element.Id = "WU_" + this.ClientId;

            if (Parent != null)
            {
                this.Parent.Element.AppendChild(this.Element);
            }

            foreach(var ctrl in this.Controls)
            {
                Control ctrl1 = JSON.Parse<Control>(JSON.Stringify(ctrl));
                switch (ctrl1.ControlName)
                {
                    case "TabControl":
                        var tc = JSON.Parse<TabControl>(JSON.Stringify(ctrl));
                        ctrl1 = tc;
                        break;
                    default:
                        ctrl1 = JSON.Parse<Control>(JSON.Stringify(ctrl));
                        break;
                }

                ctrl1.Parent = this;
                ctrl1.Render();
            }
        }

        public event EventHandler Resize;
        public event EventHandler Click;
        public event EventHandler TextChanged;

        private DockStyle mDock;
        public DockStyle Dock
        {
            get
            {
                return mDock;
            }
            set
            {
                if (mDock != value)
                {
                    mDock = value;
                    RaisePropertyChanged("Dock", value);
                }
            }
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
                    this.LabelElement.InnerHTML = value;
                    RaisePropertyChanged("Text", value);
                    if (TextChanged != null)
                    {
                        TextChanged(this, EventArgs.Empty);
                    }
                }
            }
        }

        public int Handle
        {
            get
            {
                return Convert.ToInt32(this.ClientId);
            }
        }

        public int TabIndex { get; set; }
        public string Name { get; set; }
        public bool AutoSize { get; set; }

        private Point mLocation;
        public Point Location
        {
            get
            {
                return mLocation;
            }
            set
            {
                if( mLocation != value )
                {
                    mLocation = value;
                    switch(this.Dock)
                    {
                        case DockStyle.None:
                            this.Element.Style.Top = value.X + "px";
                            this.Element.Style.Left = value.Y + "px";
                            break;
                        case DockStyle.Left:
                            this.Element.Style.Left = "0px";
                            break;
                        case DockStyle.Right:
                            this.Element.Style.Right = "0px";
                            break;
                        case DockStyle.Top:
                            this.Element.Style.Top = "0px";
                            break;
                        case DockStyle.Bottom:
                            this.Element.Style.Bottom = "0px";
                            break;
                        case DockStyle.Fill:
                            this.Element.Style.Right = "0px";
                            this.Element.Style.Bottom = "0px";
                            this.Element.Style.Left = "0px";
                            this.Element.Style.Top = "0px";
                            break;
                    }
                    RaisePropertyChanged("Location", value);
                }
            }
        }
        private Size mSize = new Size(300, 300);
        public Size Size
        {
            get
            {
                return mSize;
            }
            set
            {
                if (mSize != value)
                {
                    mSize = value;
                    switch (this.Dock)
                    {
                        case DockStyle.None:
                            this.Element.Style.Width = value.Width + "px";
                            this.Element.Style.Height = value.Height + "px";
                            break;
                        case DockStyle.Left:
                            this.Element.Style.Width = value.Width + "px";
                            this.Element.Style.Height = "100%";
                            break;
                        case DockStyle.Right:
                            this.Element.Style.Width = value.Width + "px";
                            this.Element.Style.Height = "100%";
                            break;
                        case DockStyle.Top:
                            this.Element.Style.Height = value.Height + "px";
                            this.Element.Style.Width = "100%";
                            break;
                        case DockStyle.Bottom:
                            this.Element.Style.Height = value.Height + "px";
                            this.Element.Style.Width = "100%";
                            break;
                        case DockStyle.Fill:
                            this.Element.Style.Height = "100%";
                            this.Element.Style.Width = "100%";
                            break;
                    }
                    RaisePropertyChanged("Size", value);
                    if (Resize != null)
                    {
                        Resize(this, EventArgs.Empty);
                    }
                }
            }
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

        public Size ClientSize
        {
            get
            {
                return this.Size;
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
                    RaisePropertyChanged("Visible", value);
                }
            }
        }
    }
}
