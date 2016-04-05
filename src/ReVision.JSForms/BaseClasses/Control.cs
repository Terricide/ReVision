using Bridge.Html5;
using Bridge.jQuery2;
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
                    RaisePropertyChanged("BackColor", value);
                }
            }
        }

        public Control[] Controls;

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
                    RaisePropertyChanged("Anchor", value);
                }
            }
        }

        public void Render()
        {
            this.Element.Id = "WU_" + this.ClientId;

            this.Element.Style.BackgroundColor = this.BackColor;
            this.LabelElement.InnerHTML = this.Text;
            this.Element.Style.Visibility = this.Visible ? Visibility.Visible : Visibility.Hidden;

            if (this.Parent != null)
            {
                bool rightSet = false, leftSet = false, topSet = false, bottomSet = false;
                if (this.Anchor.HasFlag(AnchorStyles.Right))
                {
                    rightSet = true;
                }
                if (this.Anchor.HasFlag(AnchorStyles.Left))
                {
                    leftSet = true;
                }
                if (this.Anchor.HasFlag(AnchorStyles.Bottom))
                {
                    topSet = true;
                }
                if (this.Anchor.HasFlag(AnchorStyles.Top))
                {
                    bottomSet = true;
                }

                if (topSet && !rightSet && !leftSet && !bottomSet)
                {
                    var width = this.Parent.Width;
                    this.Location.X = width / 2 - (this.Width / 2);
                }

                if (bottomSet && topSet && !rightSet && !leftSet)
                {
                    var height = this.Parent.Height;
                    this.Location.Y = height / 2 - (this.Height / 2);
                }

                if (bottomSet && leftSet && !topSet && !rightSet)
                {
                    var height = this.Parent.Height;
                    this.Location.Y = height - this.Height;
                }

                if (bottomSet && rightSet && !topSet && !leftSet)
                {
                    var width = this.Parent.Width;
                    this.Location.X = width - this.Width;

                    var height = this.Parent.Height;
                    this.Location.Y = height - this.Height;
                }

                if (topSet && rightSet && !leftSet && !bottomSet)
                {
                    var width = this.Parent.Width;
                    this.Location.X = width - this.Width;
                }


                if (this.Dock != DockStyle.Fill)
                {
                    this.Element.Style.Position = Position.Absolute;
                }
                else
                {
                    this.Element.Style.Position = Position.Relative;
                }
            }
            else
            {
                this.Element.Style.Position = Position.Absolute;
            }

            switch (this.Dock)
            {
                case DockStyle.None:
                    this.Element.Style.Width = this.Width + "px";
                    this.Element.Style.Height = this.Height + "px";
                    this.Element.Style.Top = this.Location.X + "px";
                    this.Element.Style.Left = this.Location.Y + "px";
                    break;
                case DockStyle.Left:
                    this.Element.Style.Left = "0px";
                    this.Element.Style.Width = this.Width + "px";
                    this.Element.Style.Height = "100%";
                    break;
                case DockStyle.Right:
                    this.Element.Style.Right = "0px";
                    this.Element.Style.Width = this.Width + "px";
                    this.Element.Style.Height = "100%";
                    break;
                case DockStyle.Top:
                    this.Element.Style.Top = "0px";
                    this.Element.Style.Height = this.Height + "px";
                    this.Element.Style.Width = "100%";
                    break;
                case DockStyle.Bottom:
                    this.Element.Style.Bottom = "0px";
                    this.Element.Style.Height = this.Height + "px";
                    this.Element.Style.Width = "100%";
                    break;
                case DockStyle.Fill:
                    this.Element.Style.Right = "0px";
                    this.Element.Style.Bottom = "0px";
                    this.Element.Style.Left = "0px";
                    this.Element.Style.Top = "0px";
                    this.Element.Style.Height = "100%";
                    this.Element.Style.Width = "100%";
                    break;
            }

            if (Parent != null)
            {
                this.Parent.Element.AppendChild(this.Element);
            }
            else
            {
                this.Element.Style.Height = "100%";
                this.Element.Style.Width = "100%";
            }

            foreach (var ctrl in this.GetControls())
            {
                ctrl.Render();
            }

            if (this.Parent != null) {
                ReAlignControls(this.Parent, this);
            }
        }

        private List<Control> mControls;
        public List<Control> GetControls()
        {
            if (mControls == null)
            {
                mControls = new List<Control>();
                if (this.Controls.Length == 0)
                {
                    return mControls;
                }
                foreach (var ctrl in this.Controls)
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
                    mControls.Add(ctrl1);
                }
            }

            return mControls;
        }

        private void ReAlignControls(Control parent, Control current)
        {
            var childControls = parent.GetControls();

            var top = 0;
            var left = 0;
            var bottom = 0;
            var right = 0;

            switch (current.Dock)
            {
                //Left
                case DockStyle.Left:
                    {
                        left = jQuery.Element(current.Element).Width();
                        foreach(var child in childControls)
                        {
                            if (child.ClientId == current.ClientId)
                            {
                                continue;
                            }
                            switch (child.Dock)
                            {
                                case DockStyle.Left:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlWidth = item.Width();
                                        item.Css("left", jQuery.Element(current.Element).Position().Left - ctrlWidth);
                                    }
                                    break;
                                case DockStyle.Bottom:
                                case DockStyle.Top:
                                case DockStyle.Fill:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlWidth = item.Width();
                                        var ctrlLeft = item.Position().Left;
                                        item.Css("left", ctrlLeft + left);
                                        item.Css("width", ctrlWidth - ctrlLeft - left);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                //Right
                case DockStyle.Right:
                    {
                        right = jQuery.Element(current.Element).Position().Left - jQuery.Element(current.Element).Width();
                        foreach (var child in childControls)
                        {
                            if (child.ClientId == current.ClientId)
                            {
                                continue;
                            }
                            switch (child.Dock)
                            {
                                case DockStyle.Right:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlWidth = item.Width();
                                        item.Css("left", jQuery.Element(current.Element).Position().Left - ctrlWidth);
                                    }
                                    break;
                                case DockStyle.Top:
                                case DockStyle.Bottom:
                                case DockStyle.Fill:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlWidth = item.Width();
                                        //var ctrlLeft = item.Position().Left;

                                        var newWidth = ctrlWidth - (ctrlWidth - right);
                                        item.Css("width", newWidth);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                //Top
                case DockStyle.Top:
                    {
                        top = jQuery.Element(current.Element).Height();
                        foreach (var child in childControls)
                        {
                            if (child.ClientId == current.ClientId)
                            {
                                continue;
                            }
                            switch (child.Dock)
                            {
                                case DockStyle.Top:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlTop = item.Position().Top;
                                        item.Css("top", ctrlTop + top);
                                    }
                                    break;
                                case DockStyle.Fill:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlTop = item.Position().Top;

                                        var ctrlHeight = item.Height();
                                        item.Css("top", ctrlTop + top);
                                        item.Css("height", ctrlHeight - top);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                //Bottom
                case DockStyle.Bottom:
                    {
                        bottom = jQuery.Element(current.Element).Height();
                        foreach (var child in childControls)
                        {
                            if (child.ClientId == current.ClientId)
                            {
                                continue;
                            }
                            switch (child.Dock)
                            {
                                case DockStyle.Left:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlTop = child.Element.OffsetTop;
                                        item.Css("top", ctrlTop - bottom);
                                    }
                                    break;
                                case DockStyle.Bottom:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlTop = child.Element.OffsetTop;
                                        item.Css("top", ctrlTop - bottom);
                                    }
                                    break;
                                case  DockStyle.Fill:
                                    {
                                        var item = jQuery.Element(child.Element);
                                        var ctrlHeight = item.Height();
                                        item.Css("height", ctrlHeight - bottom);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
            }

        }


        public int GetInt(string px)
        {
            if( px.EndsWith("px") )
            {
                px = px.Substring(0, px.Length - 2);
            }
            return Int32.Parse(px);
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

        private Drawing.Point mLocation;
        public Drawing.Point Location
        {
            get
            {
                return mLocation;
            }
            set
            {
                if ( mLocation != value)
                {
                    mLocation = value;
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
            //set
            //{
            //    this.Location = new Point(this.Top, value);
            //}
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
            //set
            //{
            //    this.Location = new Point(value, this.Top);
            //}
        }

        public int Width
        {
            get
            {
                return this.Size.Width;
            }
            //set
            //{
            //    this.Size = new Size(value, this.Height);
            //}
        }

        public int Height
        {
            get
            {
                return this.Size.Height;
            }
            //set
            //{
            //    this.Size = new Size(this.Width, value);
            //}
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
