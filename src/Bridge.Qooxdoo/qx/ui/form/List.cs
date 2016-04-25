using qx.ui.core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.form
{
    [Bridge.External]
    public class List : core.scroll.AbstractScrollArea
    {
        public Widget[] Selection { get; set; }
    }
}
