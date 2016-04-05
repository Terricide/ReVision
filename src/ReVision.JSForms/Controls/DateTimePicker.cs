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
        public DateTime Value;

        public DateTimePicker()
        {
            this.Value = DateTime.Now;
        }

        public override void Render()
        {
            base.Render();

            var dtp = new Bridge.Html5.InputElement();
            dtp.Value = (dynamic)this.Value;
            this.Element.AppendChild(dtp);

            KendoDatePicker.Element(dtp, (e) =>
            {
                Value = e.ToDynamic().sender.value();
                FireEvent(new WSEventArgs()
                {
                    ClientId = this.ClientId,
                    EventType = "valueChanged",
                    Value = this.Value
                });
            }, this.Value);
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
