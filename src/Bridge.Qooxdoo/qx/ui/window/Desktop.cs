using Bridge;
using qx.ui.core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.window
{
    [External]
    public class Desktop : core.Widget
    {
        public extern void Add(LayoutItem child);
        public extern void Remove(LayoutItem child);
        public extern void AddAfter(LayoutItem child, LayoutItem after);
        public extern void AddAt(LayoutItem child, int index);
        public extern void AddBefore(LayoutItem child, LayoutItem before);
        public extern void Block();
        public extern void BlockContent(int index);
        public extern void ForceUnblock();
        public extern Window ActiveWindow { get; set; }
        public extern Window[] Windows { get; set; }
        public extern void RemoveAll();
        public extern bool SupportsMaximize { get; }
    }
}
