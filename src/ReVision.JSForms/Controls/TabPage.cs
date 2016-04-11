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
        public TabPage()
        {
            this.Element = new qx.ui.tabview.Page();
        }

        public override void Render()
        {
            base.Render();

            var page = (qx.ui.tabview.Page)this.Element;
            page.Label = this.Text;
        }
    }
}
