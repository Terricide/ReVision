using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms.Design
{
    internal interface IParentDesigner
    {
        IDesigner GetParentDesinger();

        object GetParentService(Type objType);
    }
}
