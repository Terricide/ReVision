using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabPage : Control
    {
        public bool IsSelected { get; set; }
        public TabPage()
        {
            this.Element = new Bridge.Html5.LIElement();
        }
    }
}
