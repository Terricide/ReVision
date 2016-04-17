using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.table
{
    [Bridge.External]
    public class Table : core.Widget
    {
        public  Table(model.Abstract model)
        {

        }

        public model.Abstract TableModel { get; set; }
    }
}
