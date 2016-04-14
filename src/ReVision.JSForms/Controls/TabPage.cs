using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabPage : Control
    {
        public bool IsSelected { get; set; }
        public qx.ui.tabview.Page Page { get; set; }
        public TabPage()
        {
            this.Page = new qx.ui.tabview.Page();
            this.Element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
        }

        public override void Render()
        {
            this.Page.Layout = new qx.ui.layout.VBox();
            this.Page.Label = this.Text;
            this.Page.Add(this.Element);

            foreach(var ctrl in this.GetControls())
            {
                ctrl.Render();
            }
        }
    }
}
