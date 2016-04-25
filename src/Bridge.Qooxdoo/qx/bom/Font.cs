using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.bom
{
    [Bridge.External]
    public class Font : core.Object
    {
        public bool Bold { get; set; }
        public string Color { get; set; }
        public Bridge.Html5.TextDecoration Decoration { get; set; }
        public string[] Family { get; set; }
        public bool Italic { get; set; }
        public int LineHeight { get; set; }
        public int? Size { get; set; }
        public string TextShadow { get; set; }

        public extern static Font FromString(string font);

        //public extern static Font GetDefaultStyles();
    }
}
