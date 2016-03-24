using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Windows.Forms
{
    public class RichTextBox : Control
    {
        public override string ControlName
        {
            get
            {
                return "RichTextBox";
            }
        }

        [JsonIgnore]
        public KeyEventHandler EnterKeyDown { get; set; }

        public bool ReadOnly { get; set; }

        public RichTextBoxScrollBars ScrollBars { get; set; }
    }
}