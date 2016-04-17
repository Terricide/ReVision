using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace qx.ui.window
{
    [External]
    public class Window : core.Widget
    {
        public bool IsActive { get; set; }
        public bool AllowClose { get; set; }
        public string Caption { get; set; }
        public string Icon { get; set; }
        public bool Modal { get; set; }
        public bool Movable { get; set; }
        public bool ShowClose { get; set; }
        public bool ShowMaximize { get; set; }
        public bool ShowMinimize { get; set; }
        public bool ShowStatusBar { get; set; }
        public string Status { get; set; }
        public Visibility Visibility { get; set; }
        public extern void Open();
        public layout.Abstract Layout { get; set; }
        public extern void Center();
        public Window(string caption = null, string icon = null)
        {
            
        }
    }

    [External]
    public enum Visibility
    {
        visible,
        hidden,
        excluded
    }
}
