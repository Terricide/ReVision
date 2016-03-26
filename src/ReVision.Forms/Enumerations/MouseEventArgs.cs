using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class MouseEventArgs : EventArgs
    {
        public MouseButtons Button { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }

    public enum MouseButtons
    {
        Left
    }
}
