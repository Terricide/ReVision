using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ToolStripItem : Component
    {
        public string Name { get; set; }
        public virtual Size Size { get; set; }
        public virtual string Text { get; set; }
    }
}
