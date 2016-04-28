using Bridge;
using qx.html;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.qxevent.type
{
    [Bridge.External]
    public class Mouse : Dom
    {
        public string Button { get; }
        public int DocumentLeft { get; }
        public int DocumentTop { get; }
        public Element RelatedTarget { get; }
        public int ScreenLeft { get; }
        public int ScreenTop { get; }
        public int ViewportLeft { get; }
        public int ViewportTop { get; }

        [Name("isLeftPressed")]
        public bool IsLeftPressed { get; }
        [Name("isMiddlePressed")]
        public bool IsMiddlePressed { get; }
        [Name("isRightPressed")]
        public bool IsRightPressed { get; }
        public extern void Stop();
    }
}
