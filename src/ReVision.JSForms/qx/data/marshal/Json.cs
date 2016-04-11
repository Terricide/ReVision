using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.data.marshal
{
    [Bridge.External]
    public class Json 
    {
        public static extern object CreateModel(string rawData);
    }
}
