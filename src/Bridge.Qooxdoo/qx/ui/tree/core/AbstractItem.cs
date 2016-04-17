using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.tree.core
{
    [Bridge.External]
    public class AbstractItem : qx.ui.core.Widget
    {
        public string Icon { get; set; }
        public string IconOpened { get; set; }
        public string Label { get; set; }
        public bool Open { get; set; }
    }
}
