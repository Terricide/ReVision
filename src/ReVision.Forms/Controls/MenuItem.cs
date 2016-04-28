using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class MenuItem : HeaderedItemsControl
    {
        public int Index { get; set; }
        public ObservableControlCollection<MenuItem> MenuItems = new ObservableControlCollection<MenuItem>();
    }
}
