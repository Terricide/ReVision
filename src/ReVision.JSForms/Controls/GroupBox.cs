using Bridge.jQuery2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class GroupBox : Panel
    {
        public GroupBox()
        {
            this.RenderLabel = false;
        }

        public override void Render()
        {
            base.Render();
            this.Element.Style.BorderStyle = Bridge.Html5.BorderStyle.Solid;
            this.Element.Style.BorderWidth = Bridge.Html5.BorderWidth.Thin;
            this.Element.Style.BorderColor = "gray";

            if( this.Label == null )
            {
                this.Label = new Label();
                this.Element.AppendChild(this.Label.Element);
            }
            this.Label.Element.Style.Top = "-6px";
            this.Label.Element.Style.Left = "10px";
            this.Label.Element.Style.PaddingLeft = "2px";
            this.Label.Element.Style.PaddingRight = "2px";
            this.Label.Element.Style.BackgroundColor = "white";
            this.Label.Element.Style.Position = Bridge.Html5.Position.Relative;
            SetText(this.Label.Element);
            if (this.HasEvent("TextChanged"))
            {
                this.Label.Element.OnChange = (e) =>
                {
                    this.FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "textchanged",
                        Value = this.Label.Element.InnerHTML
                    });
                };
            }
        }
    }
}
