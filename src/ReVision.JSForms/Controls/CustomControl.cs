using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class CustomControl : Control
    {
        public CustomControl()
        {
            this.Element = new qx.ui.container.Composite(new qx.ui.layout.Basic());
        }
    }
}
