using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Menu : Control
    {
        private MenuItem[] mMenuItems;
        public MenuItem[] MenuItems
        {
            get
            {
                return mMenuItems;
            }
            set
            {
                mMenuItems = JSON.Parse<MenuItem[]>(JSON.Stringify(value));
            }
        }
    }
}
