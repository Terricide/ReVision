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
    public class Data : Event
    {
        public Data CurrentData { get; set; }
        public Data OldData { get; set; }
    }
}
