using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.basic
{
    [Bridge.External]
    public class Image : core.Widget
    {
        public string Source { get; set; }
        public bool Scale { get; set; }
    }
}
