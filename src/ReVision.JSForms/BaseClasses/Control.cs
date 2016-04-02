using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public partial class Control : Component
    {
        public Bridge.Html5.DivElement Element = new Bridge.Html5.DivElement();
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
    }
}
