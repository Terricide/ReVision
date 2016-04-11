using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Panel : Control
    {
        public override void Render()
        {
            this.Element = new qx.ui.container.Scroll();
            base.Render();
        }
    }
}
