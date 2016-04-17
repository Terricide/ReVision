using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.table.model
{
    [Bridge.External]
    public class Simple : Abstract
    {
        public object[][] Data;
        public extern void RemoveRows(int startIndex, int howMany, bool? clearSorting = null);
        public extern void AddRows(object[][] rowArr, int? startIndex = null, bool? clearSorting = null);
    }
}
