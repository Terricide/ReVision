using Bridge;
using Bridge.Html5;
using ReVision.JSForms;
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
            this.Element = new qx.ui.form.Button();
        }

        public override void Render()
        {
            base.Render();

            ((qx.ui.form.Button)this.Element).Label = this.Text;
            this.Element.AddListener("execute", (e) =>
            {
                OnClick();
            });

            //this.Parent.Element.Add(this.Element, new qx.html.Options()
            //{
            //    Left = this.Location.X,
            //    Top = this.Location.Y
            //});
            //KendoButton.Element(this.Element);
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
