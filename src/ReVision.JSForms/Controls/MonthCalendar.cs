using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class MonthCalendar : Control
    {
        public MonthCalendar()
        {
            this.Element = new qx.ui.control.DateChooser();
        }

        public override void Render()
        {
            this.Size = new Drawing.Size(227, 162);
            base.Render();
        }
    }
}
