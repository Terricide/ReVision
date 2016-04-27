using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.form
{
    [External]
    public class RadioButton : Button
    {
        public bool Value { get; set; }
        public RadioButton(string text = null)
        {
        }

        public RadioGroup Group { get; set; }
    }
}
