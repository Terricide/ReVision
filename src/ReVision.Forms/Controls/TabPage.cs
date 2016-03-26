using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabPage : ScrollableControl
    {
        public override string ControlName
        {
            get
            {
                return "TabPage";
            }
        }

        public bool UseVisualStyleBackColor { get; set; }
    }
}
