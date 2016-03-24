using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class LinkLabel : Control
    {
        public System.Drawing.Color LinkColor { get; set; }

        public LinkLabelLinkClickedEventHandler LinkClicked { get; set; }

        public override string ControlName
        {
            get
            {
                return "LinkLabel";
            }
        }
    }
}
