using qx.core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.container
{
    [Bridge.External]
    public class Composite : core.Widget
    {
        public layout.Abstract Layout { get; set; }
        public Composite()
        {

        }
        public Composite(layout.Abstract item)
        {
            return;
        }
    }
}
