using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabControl : Control
    {
        public int SelectedIndex;

        public TabControl()
        {
            this.RenderLabel = false;
            this.Element = new qx.ui.tabview.TabView();
            //this.Element = new Bridge.Html5.DivElement();
        }

        public override void Render()
        {
            this.SetAttributes();

            foreach(TabPage tp in this.GetControls())
            {
                this.Element.Add(tp.Page);
                tp.Render();
            }
        }
    }
}
