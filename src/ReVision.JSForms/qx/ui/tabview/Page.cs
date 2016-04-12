using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.tabview
{
    [External]
    public class Page : container.Composite
    {
        public string Label { get; set; }
        public string Icon { get; set; }
        public bool ShowCloseButton { get; set; }
        public layout.Abstract Layout { get; set; }
        public Page(string text = null, string icon = null)
        {
            return;
        }
    }
}
