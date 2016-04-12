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
            base.Render();
        }
    }

    public class KendoTabStrip
    {
        [Template("$({0}).kendoTabStrip({animation:{open:{effects: 'none'}}})")]
        public static KendoTabStrip Element(Element elm)
        {
            return null;
        }
    }
}
