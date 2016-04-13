using Bridge;
using Bridge.Html5;
using Bridge.jQuery2;
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

            this.Element.AddListener("appear", (e) =>
            {
                var w = (qx.ui.core.Widget)this.Element;
                var elm = w.GetContentElement().GetDomElement();
                JQueryMask.Element(elm,this.Mask);
            });

            //KendoMaskedTextBox.Element(this.Element, this.Mask);
        }
    }

    [External]
    public class JQueryMask
    {
        [Template("$({0}).mask({1})")]
        public static void Element(Element elm, string mask)
        {
            return;
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
