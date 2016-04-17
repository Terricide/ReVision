using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.qxevent.type
{
    [External]
    [Namespace("qx.event.type")]
    public class Event : core.Object
    {
        public qx.html.Element Target { get; set; }
        public qx.html.Element RelatedTarget { get; set; }
        public qx.html.Element OriginalTarget { get; set; }
        public qx.html.Element CurrentTarget { get; set; } 
        public extern void Stop();
        public extern void StopPropagation();
        public extern void PreventDefault();
        public extern bool IsCancelable();
        public string Type { get; set; }
        public int TimeStamp { get; set; }
        public bool Bubbles { get; set;  }
        public int EventPhase { get; set; }
    }
}
