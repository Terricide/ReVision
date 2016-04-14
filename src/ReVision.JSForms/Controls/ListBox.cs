using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ListBox : ListControl
    {
        public ListBox()
        {
            this.Element = new qx.ui.form.List();
        }

        public override void Render()
        {
            base.Render();

            var list = (qx.ui.form.List)this.Element;
            var items = (from l in this.Items
                         select new qx.ui.form.ListItem(l.ToString()));
            foreach(var item in items)
            {
                list.Add(item);
            }

        }
    }
}
