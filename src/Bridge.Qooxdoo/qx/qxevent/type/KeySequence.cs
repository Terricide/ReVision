using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.qxevent.type
{
    [Bridge.External]
    public class KeySequence : Dom
    {
        public int KeyCode { get; }
        public string KeyIdentifier { get; }
        public extern bool IsPrintable();
    }
}
