using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.tree.core
{
    [Bridge.External]
    public class AbstractTreeItem : AbstractItem
    {
        public extern void Add(AbstractTreeItem varargs);
    }
}
