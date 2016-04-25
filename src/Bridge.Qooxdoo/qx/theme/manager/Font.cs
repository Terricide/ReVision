using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using qx.bom;

namespace qx.theme.manager
{
    [Bridge.External]
    public class Font
    {
        public static Font Instance { get; set; }

        public object Resolve(bom.Font font)
        {
            throw new NotImplementedException();
        }
    }
}
