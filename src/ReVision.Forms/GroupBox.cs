using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class GroupBox : Control
    {
        public GroupBox()
        {
            this.BorderStyle = BorderStyle.FixedSingle;
            this.BorderColor = new BorderColor(Drawing.Color.Black);
        }

        public override string ControlName
        {
            get
            {
                return "GroupBox";            
            }
        }
    }
}
