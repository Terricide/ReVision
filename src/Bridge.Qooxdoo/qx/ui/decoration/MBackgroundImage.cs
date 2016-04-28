using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.decoration
{
    [Bridge.External]
    public static class MBackgroundImage
    {
        public static extern void SetBackgroundImage(this Decorator d, string image);
        public static extern string GetBackgroundImage(this Decorator d);
    }
}
