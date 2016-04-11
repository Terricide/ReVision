using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class MaskedTextBox : TextBox
    {
        public string Mask;

        public override void Render()
        {
            base.Render();
            //KendoMaskedTextBox.Element(this.Element, this.Mask);
        }
    }

    public class KendoMaskedTextBox
    {
        [Template("$({0}).kendoMaskedTextBox({mask:{1}})")]
        public static KendoButton Element(Element elm, string mask)
        {
            return null;
        }
    }
}
