using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Padding
    {
        public int Left { get; set; }
        public int Top { get; set; }
        public int Right { get; set; }
        public int Bottom { get; set; }
        public Padding(int pad)
        {
            this.Left = pad;
            this.Right = pad;
            this.Bottom = pad;
            this.Top = pad;
        }
        public Padding()
        {

        }
    }
}
