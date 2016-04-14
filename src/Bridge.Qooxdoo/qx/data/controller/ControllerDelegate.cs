using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using qx.ui.core;
using Bridge;

namespace qx.data.controller
{
    [Bridge.External]
    [ObjectLiteral]
    public class ControllerDelegate
    {
        public CreateItemDelegate CreateItem;

        public BindItemDelegate BindItem;

        public Action<qx.core.Object> ConfigureItem;

        //public extern void Filter(string data);
    }

    [External]
    public delegate qx.core.Object CreateItemDelegate();

    [External]
    public delegate void BindItemDelegate(controller.List controller, ui.core.Widget item, int id);
}
