using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.core
{
    [External]
    public class Widget : LayoutItem
    {
        public string BackgroundColor { get; set; }

        public extern html.Element GetContentElement();

        public string ClientId { get; set; }

        public qx.bom.Font Font { get; set; }

        public int PaddingBottom { get; set; }
        public int PaddingLeft { get; set; }
        public int PaddingRight { get; set; }
        public int PaddingTop { get; set; }
    }
}

