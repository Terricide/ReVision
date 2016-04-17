using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.tree
{
    [Bridge.External]
    public class Tree : qx.ui.core.scroll.AbstractScrollArea
    {
        public bool HideRoot { get; set; }
        public TreeFolder Root { get; set; }
        public qx.ui.core.Widget[] Selection { get; set; }
    }
}
