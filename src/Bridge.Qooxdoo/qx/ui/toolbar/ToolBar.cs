using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.toolbar
{
    [Bridge.External]
    public class ToolBar : core.Widget
    {
        public extern void Add(qx.ui.core.LayoutItem child);
        public extern void Remove(qx.ui.core.LayoutItem child);
        public extern void RemoveAll();
        public extern void RemoveAt(int index);
        public extern void AddAfter(qx.ui.core.LayoutItem child, qx.ui.core.LayoutItem after);
        public extern void AddAt(qx.ui.core.LayoutItem child, int index);
        public extern void AddBefore(qx.ui.core.LayoutItem child, qx.ui.core.LayoutItem before);
        public extern void AddSeparator();
        public core.Widget[] MenuButtons { get; }
        public qx.ui.core.LayoutItem[] Children { get; }
    }
}
