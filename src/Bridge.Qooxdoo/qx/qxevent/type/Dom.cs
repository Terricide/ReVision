using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.qxevent.type
{
    [Bridge.External]
    public class Dom : Native
    {
        public KeyModifiers Modifiers;
        public extern bool IsAltPressed();
        public extern bool IsCtrlOrCommandPressed();
        public extern bool IsCtrlPressed();
        public extern bool IsMetaPressed();
        public extern bool IsShiftPressed();
    }

    [Flags]
    public enum KeyModifiers
    {
        None,
        Shift = 1,
        Ctrl = 2,
        Alt = 4, 
        Meta = 8,       
    }
}
