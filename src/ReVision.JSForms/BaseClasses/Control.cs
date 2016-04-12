using Bridge.Html5;
using Bridge.jQuery2;
using ReVision.JSForms;
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
        public qx.core.Object Element = new qx.html.Element();
        public Label Label;
        public string ForeColor;
        public string Font;
        public ImageLayout BackgroundImageLayout;
        public Control Parent { get; set; }
        public string ParentId { get; set; }
        private qx.ui.container.Composite DockPanel;
        private Padding mPadding;
        public Padding Padding
        {
            get
            {
                return mPadding;
            }
            set
            {
                mPadding = JSON.Parse<Padding>(JSON.Stringify(value));
            }
        }
        protected bool RenderLabel = true;

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

        protected void SetText(Element elm)
        {
            if (!string.IsNullOrEmpty(this.ForeColor))
            {
                elm.Style.Color = this.ForeColor;
            }

            if (!string.IsNullOrEmpty(this.Font))
            {
                var split = this.Font.Split(',');

                elm.Style.FontFamily = split[0];

                var size = split[1].Replace("pt", "").Trim();
                var fs = Int32.Parse(size);
                fs = fs + 5;
                elm.Style.FontSize = fs + "px";
            }

            elm.InnerHTML = this.Text;
        }

        protected void SetAttributes()
        {
            qx.core.Object parentElement = null;
            if( this.Parent == null )
            {
                this.Element = Application.RootDocument;
            }
            else
            {
                parentElement = this.Parent.Element;

                qx.ui.core.LayoutItem li = null;
                if (this.Element is qx.ui.core.LayoutItem)
                {
                    li = (qx.ui.core.LayoutItem)this.Element;
                }

                switch (this.Dock)
                {
                    case DockStyle.None:
                        parentElement.Add(this.Element, new qx.core.Options()
                        {
                            Left = this.Location.X,
                            Top = this.Location.Y
                        });
                        li.Width = this.Width;
                        li.Height = this.Height;
                        break;
                    case DockStyle.Left:
                        {
                            CreateDockPanel(parentElement);

                            var layout = new qx.ui.container.Composite(new qx.ui.layout.Basic());
                            layout.Width = this.Width;
                            layout.BackgroundColor = this.BackColor;
                            layout.Add(this.Element);

                            DockPanel.Add(layout, new qx.core.Options()
                            {
                                Edge = qx.core.Edges.West,
                            });
                            li.Width = this.Width;
                        }
                        break;
                    case DockStyle.Right:
                        {
                            CreateDockPanel(parentElement);

                            var layout = new qx.ui.container.Composite(new qx.ui.layout.Basic());
                            layout.Width = this.Width;
                            layout.BackgroundColor = this.BackColor;
                            layout.Add(this.Element);

                            DockPanel.Add(layout, new qx.core.Options()
                            {
                                Edge = qx.core.Edges.East,
                            });
                            li.Width = this.Width;
                        }
                        break;
                    case DockStyle.Top:
                        {
                            CreateDockPanel(parentElement);
                            //var w1 = new qx.ui.core.Widget();
                            //w1.BackgroundColor = this.BackColor;//.Add(this.Element);
                            //w1.Height = this.Height;

                            var layout = new qx.ui.container.Composite(new qx.ui.layout.Basic());
                            layout.Height = this.Height;
                            layout.BackgroundColor = this.BackColor;
                            layout.Add(this.Element);

                            DockPanel.Add(layout, new qx.core.Options()
                            {
                                Edge = qx.core.Edges.North,
                            });
                            //w1.Add(layout);
                            li.Height = this.Height;
                        }
                        break;
                    case DockStyle.Bottom:
                        {
                            CreateDockPanel(parentElement);

                            var layout = new qx.ui.container.Composite(new qx.ui.layout.Basic());
                            layout.Height = this.Height;
                            layout.BackgroundColor = this.BackColor;
                            layout.Add(this.Element);

                            DockPanel.Add(layout, new qx.core.Options()
                            {
                                Edge = qx.core.Edges.South,
                            });
                            li.Height = this.Height;
                        }
                        break;
                    case DockStyle.Fill:
                        {
                            ResizeDockFill(parentElement, li);
                        }
                        break;
                }

            }

            switch (this.Dock)
            {
                case DockStyle.Fill:
                    break;
                default:
                    {
                        if (this.Element is qx.ui.core.LayoutItem)
                        {
                            var li = (qx.ui.core.LayoutItem)this.Element;
                            li.Width = this.Width;
                            li.Height = this.Height;
                        }
                    }
                    break;
            }

            if (this.Element is qx.ui.core.Widget)
            {
                var li = (qx.ui.core.Widget)this.Element;
                var bc = this.BackColor;
                if( !string.IsNullOrEmpty(bc) )
                {
                    li.BackgroundColor = this.BackColor;
                    //li.BackgroundColor = "#0f0";
                }
            }

            //this.Element.Id = "WU_" + this.ClientId;

            //this.Element.Style.BackgroundColor = this.BackColor;
            //this.Element.Style.Visibility = this.Visible ? Visibility.Visible : Visibility.Hidden;

            //if (this.Parent != null)
            //{
            //    bool rightSet = false, leftSet = false, topSet = false, bottomSet = false;
            //    if (this.Anchor.HasFlag(AnchorStyles.Right))
            //    {
            //        rightSet = true;
            //    }
            //    if (this.Anchor.HasFlag(AnchorStyles.Left))
            //    {
            //        leftSet = true;
            //    }
            //    if (this.Anchor.HasFlag(AnchorStyles.Top))
            //    {
            //        topSet = true;
            //    }
            //    if (this.Anchor.HasFlag(AnchorStyles.Bottom))
            //    {
            //        bottomSet = true;
            //    }

            //    if (topSet && !rightSet && !leftSet && !bottomSet)
            //    {
            //        var width = this.Parent.Width;
            //        this.Location.X = width / 2 - (this.Width / 2);
            //    }

            //    if (bottomSet && topSet && !rightSet && !leftSet)
            //    {
            //        var height = this.Parent.Height;
            //        this.Location.Y = height / 2 - (this.Height / 2);
            //    }

            //    if (bottomSet && leftSet && !topSet && !rightSet)
            //    {
            //        var height = this.Parent.Height;
            //        this.Location.Y = height - this.Height;
            //    }

            //    if (bottomSet && rightSet && !topSet && !leftSet)
            //    {
            //        var width = this.Parent.Width;
            //        this.Location.X = width - this.Width;

            //        var height = this.Parent.Height;
            //        this.Location.Y = height - this.Height;
            //    }

            //    if (topSet && rightSet && !leftSet && !bottomSet)
            //    {
            //        var width = this.Parent.Width;
            //        this.Location.X = width - this.Width;
            //    }

            //    this.Element.Style.Position = Position.Absolute;
            //}
            //else
            //{
            //    this.Element.Style.Position = Position.Absolute;
            //}

            //switch (this.Dock)
            //{
            //    case DockStyle.None:
            //        this.Element.Style.Width = this.Width + "px";
            //        this.Element.Style.Height = this.Height + "px";
            //        this.Element.Style.Top = this.Location.Y + "px";
            //        this.Element.Style.Left = this.Location.X + "px";
            //        break;
            //    case DockStyle.Left:
            //        this.Element.Style.Left = "0px";
            //        this.Element.Style.Width = this.Width + "px";
            //        this.Element.Style.Height = "100%";
            //        break;
            //    case DockStyle.Right:
            //        this.Element.Style.Right = "0px";
            //        this.Element.Style.Width = this.Width + "px";
            //        this.Element.Style.Height = "100%";
            //        break;
            //    case DockStyle.Top:
            //        this.Element.Style.Top = "0px";
            //        this.Element.Style.Height = this.Height + "px";
            //        this.Element.Style.Width = "100%";
            //        break;
            //    case DockStyle.Bottom:
            //        this.Element.Style.Bottom = "0px";
            //        this.Element.Style.Height = this.Height + "px";
            //        this.Element.Style.Width = "100%";
            //        break;
            //    case DockStyle.Fill:
            //        this.Element.Style.Right = "0px";
            //        this.Element.Style.Bottom = "0px";
            //        this.Element.Style.Left = "0px";
            //        this.Element.Style.Top = "0px";
            //        this.Element.Style.Height = "100%";
            //        this.Element.Style.Width = "100%";
            //        break;
            //}

            //this.Element.Style.PaddingTop = this.Padding.Top + "px";
            //this.Element.Style.PaddingLeft = this.Padding.Left + "px";
            //this.Element.Style.PaddingRight = this.Padding.Right + "px";
            //this.Element.Style.PaddingBottom = this.Padding.Bottom + "px";

            //if (Parent != null)
            //{
            //    if (jQuery.Element(this.Parent.Element).Has(this.Element).Length == 0)
            //    {
            //        this.Parent.Element.AppendChild(this.Element);
            //    }
            //}
            //else
            //{
            //    this.Element.Style.Height = "100%";
            //    this.Element.Style.Width = "100%";
            //}

            //SetupEventHandlers();

            //if (this.RenderLabel)
            //{
            //    if (!string.IsNullOrEmpty(this.Text))
            //    {
            //        if( this.Label == null )
            //        {
            //            this.Label = new Label();
            //        }
            //        SetText(this.Label.Element);
            //        if (this.HasEvent("TextChanged"))
            //        {
            //            this.Label.Element.OnChange = (e) =>
            //            {
            //                this.FireEvent(new WSEventArgs()
            //                {
            //                    ClientId = this.ClientId,
            //                    EventType = "textchanged",
            //                    Value = this.Label.Element.InnerHTML
            //                });
            //            };
            //        }
            //        this.Element.AppendChild(this.Label.Element);
            //    }
            //}

            //if (!string.IsNullOrEmpty(this.BackgroundImage))
            //{
            //    jQuery.Element(this.Element).Css("background-image", "url('data:image/png;base64," + this.BackgroundImage + "')");
            //    switch (this.BackgroundImageLayout)
            //    {
            //        case ImageLayout.Stretch:
            //            jQuery.Element(this.Element).Css("background-size", "cover");
            //            break;
            //    }
            //}
        }

        private void ResizeDockFill(qx.core.Object parentElement, qx.ui.core.LayoutItem li)
        {
            var bounds = ((qx.ui.core.LayoutItem)this.Parent.Element).GetBounds();

            var ctrls = this.Parent.GetControls().ToArray();
            ctrls.Reverse();
            int right = 0, bottom = 0;


            for (int i = 0; i < ctrls.Length; i++)
            {
                var ctrl = ctrls[i];
                if (ctrl == this)
                {
                    break;
                }
                switch (ctrl.Dock)
                {
                    case DockStyle.Right:
                        right += ctrl.Width;
                        break;
                    case DockStyle.Bottom:
                        bottom += ctrl.Height;
                        break;
                }
            }

            var newWidth = bounds.Width - this.Left - right;
            var newHeight = bounds.Height - this.Top - bottom;

            li.Width = newWidth;
            li.Height = newHeight;

            parentElement.Add(this.Element, new qx.core.Options()
            {
                Left = this.Left,
                Top = this.Top,
            });
        }

        private void CreateDockPanel(qx.core.Object parentElement)
        {
            if (DockPanel == null)
            {
                DockPanel = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                //DockPanel.AllowStretchX = true;
                //DockPanel.AllowStretchY = true;
                //DockPanel.AllowGrowY = true;
                //DockPanel.AllowGrowX = true;
                //var pl = ((qx.html.Element)parentElement);
                //var element = pl.GetDomElement();
                //DockPanel.Width = element.ClientWidth;
                //DockPanel.Height = element.ClientHeight;
                parentElement.Add(DockPanel, new qx.core.Options()
                {
                    Edge = 0                
                });
            }
        }

        public virtual void Render()
        {
            SetAttributes();

            foreach (var ctrl in this.GetControls())
            {
                ctrl.Render();
            }

            //if (this.Parent != null)
            //{
            //    ReAlignControls(this.Parent, this);
            //}
        }

        private void SetupEventHandlers()
        {
            //if (this.HasEvent("Click"))
            //{
            //    this.Element.OnClick = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "click"
            //        });
            //    };
            //}

            //if (this.HasEvent("MouseMove"))
            //{
            //    this.Element.OnMouseMove = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mousemove",
            //            Value = e
            //        });
            //    };
            //};

            //if (this.HasEvent("MouseEnter"))
            //{
            //    this.Element.OnMouseEnter = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mouseenter",
            //            Value = e
            //        });
            //    };
            //};

            //if (this.HasEvent("MouseLeave"))
            //{
            //    this.Element.OnMouseLeave = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mouseleave",
            //            Value = e
            //        });
            //    };
            //};

            //if (this.HasEvent("TextChanged"))
            //{
            //    this.Element.OnChange = (e) =>
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "mouseleave",
            //            Value = e
            //        });
            //    };
            //}
        }

        public virtual async Task FireEvent(WSEventArgs evt)
        {
            Application.Current.Send(evt);
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
                        case "Button":
                            var btn = JSON.Parse<Button>(JSON.Stringify(ctrl));
                            ctrl1 = btn;
                            break;
                        case "Label":
                            var lbl = JSON.Parse<Label>(JSON.Stringify(ctrl));
                            ctrl1 = lbl;
                            break;
                        case "RadioButton":
                            var rb = JSON.Parse<RadioButton>(JSON.Stringify(ctrl));
                            ctrl1 = rb;
                            break;
                        case "CheckBox":
                            var cb = JSON.Parse<CheckBox>(JSON.Stringify(ctrl));
                            ctrl1 = cb;
                            break;
                        case "TabPage":
                            var tp = JSON.Parse<TabPage>(JSON.Stringify(ctrl));
                            ctrl1 = tp;
                            break;
                        case "LinkLabel":
                            var ll = JSON.Parse<LinkLabel>(JSON.Stringify(ctrl));
                            ctrl1 = ll;
                            break;
                        case "ComboBox":
                            var cb1 = JSON.Parse<ComboBox>(JSON.Stringify(ctrl));
                            ctrl1 = cb1;
                            break;
                        case "DateTimePicker":
                            var dtp = JSON.Parse<DateTimePicker>(JSON.Stringify(ctrl));
                            ctrl1 = dtp;
                            break;
                        case "GroupBox":
                            var gb = JSON.Parse<GroupBox>(JSON.Stringify(ctrl));
                            ctrl1 = gb;
                            break;
                        case "Panel":
                            var pn = JSON.Parse<Panel>(JSON.Stringify(ctrl));
                            ctrl1 = pn;
                            break;
                        case "TextBox":
                            var tb = JSON.Parse<TextBox>(JSON.Stringify(ctrl));
                            ctrl1 = tb;
                            break;
                        case "MaskedTextBox":
                            var mtb = JSON.Parse<MaskedTextBox>(JSON.Stringify(ctrl));
                            ctrl1 = mtb;
                            break;
                        case "SplitContainer":
                            var sc = JSON.Parse<SplitContainer>(JSON.Stringify(ctrl));
                            ctrl1 = sc;
                            break;
                        case "TreeView":
                            var tv = JSON.Parse<TreeView>(JSON.Stringify(ctrl));
                            ctrl1 = tv;
                            break;
                        case "CheckedListBox":
                            var clb = JSON.Parse<CheckedListBox>(JSON.Stringify(ctrl));
                            ctrl1 = clb;
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

        protected override async Task RaisePropertyChanged(string propName, object val)
        {
            await base.RaisePropertyChanged(propName, val);

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

        //public void RealignControls()
        //{
        //    foreach (var ctrl in this.GetControls())
        //    {
        //        ctrl.ReAlignControls(this, ctrl);
        //    }
        //}

        //protected void ReAlignControls(Control parent, Control current)
        //{
        //    var childControls = parent.GetControls();

        //    var top = 0;
        //    var left = 0;
        //    var bottom = 0;
        //    var right = 0;

        //    switch (current.Dock)
        //    {
        //        //Left
        //        case DockStyle.Left:
        //            {
        //                left = jQuery.Element(current.Element).Width();
        //                foreach(var child in childControls)
        //                {
        //                    if (child.ClientId == current.ClientId)
        //                    {
        //                        break;
        //                    }
        //                    switch (child.Dock)
        //                    {
        //                        case DockStyle.Left:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlWidth = item.Width();
        //                                item.Css("left", jQuery.Element(current.Element).Position().Left + ctrlWidth);
        //                            }
        //                            break;
        //                        case DockStyle.Top:
        //                        case DockStyle.Bottom:
        //                        case DockStyle.Fill:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlWidth = item.Width();
        //                                var ctrlLeft = item.Position().Left;
        //                                item.Css("left", ctrlLeft + left);
        //                                item.Css("width", ctrlWidth - left);
        //                            }
        //                            break;
        //                    }
        //                }
        //            }
        //            break;
        //        //Right
        //        case DockStyle.Right:
        //            {
        //                right = jQuery.Element(current.Element).Width();
        //                foreach (var child in childControls)
        //                {
        //                    if (child.ClientId == current.ClientId)
        //                    {
        //                        break;
        //                    }
        //                    switch (child.Dock)
        //                    {
        //                        case DockStyle.Right:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlWidth = item.Width();
        //                                item.Css("left", jQuery.Element(current.Element).Position().Left - ctrlWidth);
        //                            }
        //                            break;
        //                        case DockStyle.Top:
        //                        case DockStyle.Bottom:
        //                        case DockStyle.Fill:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlWidth = item.Width();

        //                                item.Css("width", ctrlWidth - right);
        //                            }
        //                            break;
        //                    }
        //                }
        //            }
        //            break;
        //        //Top
        //        case DockStyle.Top:
        //            {
        //                top = jQuery.Element(current.Element).Height();
        //                foreach (var child in childControls)
        //                {
        //                    if (child.ClientId == current.ClientId)
        //                    {
        //                        break;
        //                    }
        //                    switch (child.Dock)
        //                    {
        //                        case DockStyle.Top:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlTop = item.Position().Top;
        //                                item.Css("top", ctrlTop + top);
        //                            }
        //                            break;
        //                        case DockStyle.Left:
        //                        case DockStyle.Right:
        //                        case DockStyle.Fill:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlTop = item.Position().Top;

        //                                var ctrlHeight = item.Height();
        //                                item.Css("top", ctrlTop + top);
        //                                item.Css("height", ctrlHeight - top);
        //                            }
        //                            break;
        //                    }
        //                }
        //            }
        //            break;
        //        //Bottom
        //        case DockStyle.Bottom:
        //            {
        //                bottom = jQuery.Element(current.Element).Height();
        //                foreach (var child in childControls)
        //                {
        //                    if (child.ClientId == current.ClientId)
        //                    {
        //                        break;
        //                    }
        //                    switch (child.Dock)
        //                    {
        //                        case DockStyle.Right:
        //                        case DockStyle.Fill:
        //                        case DockStyle.Left:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                item.Css("height", item.Height() - bottom);
        //                            }
        //                            break;
        //                        case DockStyle.Bottom:
        //                            {
        //                                var item = jQuery.Element(child.Element);
        //                                var ctrlTop = child.Element.OffsetTop;
        //                                item.Css("top", ctrlTop - bottom);
        //                            }
        //                            break;
        //                    }
        //                }
        //            }
        //            break;
        //    }

        //}


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

        public void OnClick()
        {
            this.FireEvent(new WSEventArgs()
            {
                ClientId = this.ClientId,
                EventType = "click"
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

        public Size ClientSize;

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
