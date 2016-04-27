using Bridge.Html5;
using Bridge.jQuery2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class CheckBox : ButtonBase
    {
        public CheckBox()
        {
            this.Element = new qx.ui.form.CheckBox();
        }
        public bool Checked { get; set; }
        public override void Render()
        {
            base.Render();
            var cb = (qx.ui.form.CheckBox)this.Element;
            cb.Label = this.Text;
            cb.Value = this.Checked;

            cb.AddListener("changeValue", (e) =>
            {
                this.Checked = cb.Value;
                FireEvent(new WSEventArgs()
                {
                    ClientId = this.ClientId,
                    EventType = "checkChanged",
                    Value = cb.Value
                });
            });

            //var elm = jQuery.Element(this.Element);

            //elm.Css("cursor", "pointer");

            //if (rb == null)
            //{
            //    rb = new Bridge.Html5.InputElement();
            //    this.Element.AppendChild(rb);
            //}
            //rb.Id = "RB_" + this.ClientId;
            //rb.Type = InputType.Checkbox;
            //rb.Name = this.Parent.ClientId + "rb_group";
            //rb.Checked = this.Checked;

            //rb.OnChange = (e) =>
            //{
            //    this.Checked = rb.Checked;
            //    FireEvent(new WSEventArgs()
            //    {
            //        ClientId = this.ClientId,
            //        EventType = "checkChanged",
            //        Value = rb.Checked
            //    });
            //};

            //base.Render();

            //this.Element.OnClick = (e) =>
            //{
            //    rb.Checked = !rb.Checked;
            //    if (this.HasEvent("Click"))
            //    {
            //        this.FireEvent(new WSEventArgs()
            //        {
            //            ClientId = this.ClientId,
            //            EventType = "click"
            //        });
            //    }
            //};

        }
    }
}
