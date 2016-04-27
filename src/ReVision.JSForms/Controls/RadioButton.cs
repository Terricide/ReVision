using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.jQuery2;
using Bridge.Html5;

namespace System.Windows.Forms
{
    public class RadioButton : ButtonBase
    {
        public bool Checked { get; set; }

        public RadioButton()
        {
            this.Element = new qx.ui.form.RadioButton();
        }

        public override void Render()
        {
            base.Render();

            var rb = (qx.ui.form.RadioButton)this.Element;
            rb.Label = this.Text;
            rb.Value = this.Checked;
            rb.AddListener("changeValue", (e) =>
            {
                this.Checked = rb.Value;
                FireEvent(new WSEventArgs()
                {
                    ClientId = this.ClientId,
                    EventType = "checkChanged",
                    Value = rb.Value
                });
            });

            //qx.ui.form.RadioGroup group = null;
            //var groupId = this.Parent.ClientId + "rb_group";
            //if( rbGroups.ContainsKey(groupId) )
            //{
            //    group = rbGroups[groupId];
            //}
            //else
            //{
            //    group = new qx.ui.form.RadioGroup();
            //    rbGroups.Add(groupId, group);
            //}
            rb.Group = this.Parent.radioButtonGroup;

            //var elm = jQuery.Element(this.Element);

            //elm.Css("cursor", "pointer");

            //if(rb == null)
            //{
            //    rb = new Bridge.Html5.InputElement();
            //    this.Element.AppendChild(rb);
            //}
            //rb.Id = "RB_" + this.ClientId;
            //rb.Type = InputType.Radio;
            //rb.Name = this.Parent.ClientId + "rb_group";
            //rb.Checked = this.Checked;

            //rb.OnChange = (e) =>
            //{

            //};

            //base.Render();

            //this.Element.OnClick = (e) =>
            //{
            //    if( !rb.Checked )
            //    {
            //        rb.Checked = true;
            //    }

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
