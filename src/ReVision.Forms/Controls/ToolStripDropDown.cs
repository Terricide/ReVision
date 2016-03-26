using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ToolStripDropDown : ToolStrip
    {
    }

    public class ToolStrip : ScrollableControl
    {
        private ObservableControlCollection<ToolStripItem> mItems;
        public virtual ObservableControlCollection<ToolStripItem> Items
        {
            get
            {
                if( mItems == null )
                {
                    mItems = new ObservableControlCollection<ToolStripItem>(); 
                }
                return mItems;
            }
        }
    }
}
