using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Windows.Forms
{
    public class ListViewItem : Control
    {
        public ListViewItem(string text = null)
        {
            this.Text = text;
            if( !string.IsNullOrEmpty(text) )
            {
                this.SubItems.Add(text);
            }
        }
        
        public List<Object> SubItems = new List<object>();
    }
}