using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Form : Control
    {
        public Form()
        {
            this.RenderLabel = false;
        }
        public void ShowDialog()
        {
            this.Render();
        }
    }
}
