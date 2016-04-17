using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.splitpane
{
    [External]
    public class Pane : core.Widget
    {
        public Pane(SplitPaneType type)
        {

        }

        public extern void Add(qx.core.Object obj, int num);
    }

    [Namespace(false)]
    [Enum(Emit.StringNameLowerCase)]
    public enum SplitPaneType
    {
        Verical,
        Horizontal
    }
}
