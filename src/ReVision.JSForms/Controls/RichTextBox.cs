using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class RichTextBox : Control
    {
        public bool ReadOnly;

        public RichTextBox()
        {
            this.Element = new qx.ui.form.TextArea();
        }

        public override void Render()
        {
            base.Render();

            //var area = (TextAreaElement)this.Element;
            //area.ReadOnly = this.ReadOnly;
            //area.Value = this.Text;
            //area.Style.OverflowY = Bridge.Html5.Overflow.Auto;
        }
    }
}
