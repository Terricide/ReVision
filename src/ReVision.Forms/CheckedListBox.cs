using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class CheckedListBox : ListBox
    {
        public override string ControlName
        {
            get
            {
                return "CheckedListBox";
            }
        }
    }
}
