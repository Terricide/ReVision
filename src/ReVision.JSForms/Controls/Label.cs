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
            this.Element = new qx.ui.basic.Label();
        }

        public override void Update(WSEventArgs evt)
        {
            base.Update(evt);

            switch (evt.PropertyUpdate.Name)
            {
                case "Text":
                    this.Text = evt.PropertyUpdate.Value as string;
                    var lbl = (qx.ui.basic.Label)this.Element;
                    lbl.Value = this.Text;
                    break;
            }
        }

        public override void Render()
        {
            base.Render();
            var lbl = (qx.ui.basic.Label)this.Element;
            lbl.Value = this.Text;
        }
    }
}
