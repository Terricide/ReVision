using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.form
{
    [Bridge.External]
    public class AbstractSelectBox : core.Widget
    {
        public List ChildrenContainer { get; }
        public extern int IndexOf(qx.ui.core.LayoutItem item);
    }
}
