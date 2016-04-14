using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.embed
{
    [External]
    public class Html : core.Widget
    {
        [Name("Html")]
        public string HtmlContext { get; set; }
    }
}
