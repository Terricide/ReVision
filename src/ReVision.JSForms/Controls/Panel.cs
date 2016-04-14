using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Panel : Control
    {
        public Panel()
        {
            this.Element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
        }

        public override void Render()
        {
            base.Render();
        }
    }
}
