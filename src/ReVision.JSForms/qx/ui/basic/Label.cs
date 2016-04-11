using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.basic
{
    [External]
    public class Label : html.Element
    {
        public string Value { get; set; }
        public int Width { get; set; }
    }
}
