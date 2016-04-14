using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.html
{
    [External]
    public class Element : qx.core.Object
    {
        public extern Bridge.Html5.Element GetDomElement();
    }    
}
