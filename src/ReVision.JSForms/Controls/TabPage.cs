using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabPage : Control
    {
        public bool IsSelected { get; set; }
        private bool IsLoaded;
        private Bridge.Html5.LIElement li;
        public TabPage()
        {
            
        }

        public override void Render()
        {
            this.Element.Style.Width = (this.Parent.Width - 27) + "px";
            this.Element.Style.Height = (this.Parent.Height - 35) + "px";
            this.Element.Style.Position = Bridge.Html5.Position.Relative;
            if(!IsLoaded)
            {
                this.Parent.Element.AppendChild(this.Element);
                IsLoaded = true;
            }

            foreach (var ctrl in this.GetControls())
            {
                ctrl.Render();
            }
        }

        public void RenderTabs(Element parent)
        {
            if( li == null )
            {
                li = new Bridge.Html5.LIElement();
                li.Id = "LI_" + this.ClientId;
                parent.AppendChild(li);
            }
            li.InnerHTML = this.Text;
            if( IsSelected )
            {
                li.ClassName = "k-state-active";
            }
            else
            {
                li.ClassName = "";
            }
        }
    }
}
