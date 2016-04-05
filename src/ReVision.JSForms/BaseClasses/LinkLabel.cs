using Bridge.jQuery2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class LinkLabel : Control
    {
        public override void Render()
        {
            base.Render();

            jQuery.Element(this.Element).Css("cursor", "pointer");

            if (string.IsNullOrEmpty(this.Font))
            {
                this.Label.Element.Style.Color = "blue";
                this.Label.Element.Style.TextDecoration = Bridge.Html5.TextDecoration.Underline;
            }

            if (this.HasEvent("LinkClicked"))
            {
                this.Element.OnClick = (e) =>
                {
                    FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "linkClicked"
                    });
                };
            };
        }
    }
}
