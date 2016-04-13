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

        public override void Render()
        {
            base.Render();
            var pb = (qx.ui.indicator.ProgressBar)this.Element;
            pb.Value = this.Value;
            pb.Maximum = this.Maximum;
        }
    }
}
