using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ProgressBar : Control
    {
        public int Value;
        public int Maximum;
        public ProgressBar()
        {
            this.Element = new qx.ui.indicator.ProgressBar();
        }

        public override void Update(WSEventArgs evt)
        {
            base.Update(evt);

            switch(evt.PropertyUpdate.Name)
            {
                case "Value":
                    var pb = (qx.ui.indicator.ProgressBar)this.Element;
                    pb.Value = (int)evt.PropertyUpdate.Value;
                    break;
            }
        }

        public override void Render()
        {
            base.Render();
            var pb = (qx.ui.indicator.ProgressBar)this.Element;
            pb.Value = this.Value;
            pb.Maximum = this.Maximum;
        }
    }
}
