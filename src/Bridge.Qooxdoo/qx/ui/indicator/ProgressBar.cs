using Bridge;
using qx.ui.container;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.indicator
{
    [External]
    public class ProgressBar : Composite
    {
        public int Value { get; set; }
        public int Maximum { get; set; }
    }
}
