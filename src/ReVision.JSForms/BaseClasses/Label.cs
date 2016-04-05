using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Label : Control
    {
        public Label()
        {
            this.Element = new Bridge.Html5.SpanElement();
        }
    }
}
