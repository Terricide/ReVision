using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace System.Windows.Forms
{
    public class Label : Control
    {
        public override string ControlName
        {
            get
            {
                return "Label";
            }
        }

        public virtual ContentAlignment TextAlign { get; set; }
    }
}