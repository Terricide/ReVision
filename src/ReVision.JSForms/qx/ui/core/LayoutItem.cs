using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.core
{
    [External]
    public class LayoutItem : qx.core.Object
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public bool AllowGrowX { get; set; }
        public bool AllowGrowY { get; set; }
        public bool AllowStretchX { get; set; }
        public bool AllowStretchY { get; set; }

        public extern Bounds GetBounds();
    }

    public class Bounds
    {
        public int Left;
        public int Top;
        public int Width;
        public int Height;    
    }
}
