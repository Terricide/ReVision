using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class DateTimePicker : Control
    {
        private Date mValue;
        public Date Value
        {
            get
            {
                return mValue;
            }
            set
            {
                string val = (dynamic)value;
                mValue = new Date(val);
            }
        }


        public DateTimePicker()
        {
            //this.Value = DateTime.Now;
            this.Element = new qx.ui.form.DateField();
        }

        public override void Render()
        {
            base.Render();

            var dtp = (qx.ui.form.DateField)this.Element;
            dtp.Value = this.mValue;

            //if( dtp == null )
            //{
            //    dtp = new Bridge.Html5.InputElement();
            //    this.Element.AppendChild(dtp);
            //}
            //dtp.Value = (dynamic)this.Value;

            //KendoDatePicker.Element(dtp, (e) =>
            //{
            //    Value = e.ToDynamic().sender.value();
            //    FireEvent(new WSEventArgs()
            //    {
            //        ClientId = this.ClientId,
            //        EventType = "valueChanged",
            //        Value = this.Value
            //    });
            //}, this.Value);
        }

        public class KendoDatePicker
        {
            [Template("$({0}).kendoDatePicker({ change: {1}, value: {2} })")]
            public static KendoDatePicker Element(Element elm, Action<Event> change, DateTime val)
            {
                return null;
            }
        }

    }
}
