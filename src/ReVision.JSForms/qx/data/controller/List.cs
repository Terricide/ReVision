using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using qx.ui.core;
using qx.ui.form;

namespace qx.data.controller
{
    [Bridge.External]
    public class List
    {
        public List(object p, ui.form.List list)
        {
            return;
        }

        public List(object arrayWrapper, ui.form.List list, string v)
        {
            return;
        }

        public ControllerDelegate Delegate { get; set; }
        public Array Model { get;  set; }

        public extern void BindProperty(string v1, string v2, object p, Widget item, int id);

        public extern void BindPropertyReverse(string v1, string v2, object p, Widget item, int id);
    }
}
