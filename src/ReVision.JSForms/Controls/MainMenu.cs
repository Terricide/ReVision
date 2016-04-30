using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class MainMenu : Menu
    {
        public MainMenu()
        {
            this.Element = new qx.ui.menubar.MenuBar();
        }

        public override void Render()
        {
            base.Render();

            var mb = (qx.ui.menubar.MenuBar)this.Element;
            foreach(var mi in MenuItems)
            {
                mb.Add(new qx.ui.menubar.Button(mi.Name, null, null));
            }
        }
    }
}
