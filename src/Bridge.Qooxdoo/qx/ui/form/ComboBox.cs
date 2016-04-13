using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.form
{
    [Bridge.External]
    public class ComboBox : AbstractSelectBox
    {
        public TextField TextField;
        public string Value { get; set; }
    }
}
