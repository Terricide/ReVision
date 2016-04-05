using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Button : ButtonBase
    {
        public Button()
        {
            this.Element = new Bridge.Html5.ButtonElement();
        }

        public override void Render()
        {
            base.Render();

            KendoButton.Element(this.Element);
        }
    }

    public class KendoButton
    {
        [Template("$({0}).kendoButton()")]
        public static KendoButton Element(Element elm)
        {
            return null;
        }
    }
}
