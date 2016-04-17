using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.table.model
{
    [Bridge.External]
    public class Abstract : qx.core.Object
    {
        public int RowCount { get; set; }
        public extern void SetColumns(string[] columns, string columnIds = null);
    }
}
