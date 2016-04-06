using Bridge.Html5;
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
            this.RenderLabel = false;
            this.Element = new Bridge.Html5.SpanElement();
        }

        public override void Render()
        {
            base.Render();
            SetText(this.Element);
        }
    }
}
