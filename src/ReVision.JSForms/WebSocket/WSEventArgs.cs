using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class WSEventArgs
    {
        public string ClientId;
        public string EventType;
        public object Value;

        public PropertyUpdate PropertyUpdate
        {
            get
            {
                return JSON.Parse<PropertyUpdate>(JSON.Stringify(this.Value));
            }
        }
    }

    public class PropertyUpdate
    {
        public string Name;
        public object Value;
    }
}
