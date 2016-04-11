using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.Html5;
using Bridge;

namespace System.Windows.Forms
{
    public class ComboBox : Control
    {
        public ComboBox()
        {
            this.Element = new qx.ui.form.ComboBox();
        }
        public object[] Items;

        private InputElement cb;

        public int SelectedIndex;

        public override void Render()
        {
            //if (this.cb == null)
            //{
            //    this.cb = new Bridge.Html5.InputElement();
            //    this.cb.Id = "CB_" + this.ClientId;
            //    this.Element.AppendChild(this.cb);
            //}

            //        for (var i = 0; i < obj.Items.length; i++)
            //        {
            //            var item = {
            //        text: obj.Items[i],
            //        value: i
            //            };
            //        ds.push(item);
            //    }

            //this.cb = $(this.ComboBox).kendoComboBox({
            //        dataTextField: "text",
            //    dataValueField: "value",
            //    dataSource: ds,
            //    filter: "contains",
            //    suggest: true,
            //    change: function(e) {
            //            var cmb = this;
            //            var evt = {
            //            ClientId: this.element[0].id,
            //            EventType: 'selectedIndexChanged',
            //            Value: cmb.selectedIndex
            //        };
            //        send(evt);
            //    }
            //});

            //ListItem[] arr = new ListItem[Items.Length];

            //for (int i = 0; i < Items.Length; i++)
            //{
            //    arr[i] = new ListItem()
            //    {
            //        Text = Items[i],
            //        Value = i
            //    };
            //}

            //var kb = KendoComboBox.Element(this.cb, "text", "value", "contains", true, arr, (e) =>
            //{
            //    var cmd = e.ToDynamic();
            //    this.SelectedIndex = cmd.sender.selectedIndex;
            //    FireEvent(new WSEventArgs()
            //    {
            //        ClientId = this.ClientId,
            //        EventType = "selectedIndexChanged",
            //        Value = cmd.sender.selectedIndex
            //    });
            //}, this.SelectedIndex);

            base.Render();
            var cb = (qx.ui.form.ComboBox)this.Element;
            cb.Value = this.Text;
            //cb.TextField.Value = this.Text;
            foreach (var obj in Items)
            {
                cb.Add(new qx.ui.form.ListItem(obj.ToString()));
            }
        }

        public class KendoComboBox
        {
            [Template("$({0}).kendoComboBox({ dataTextField:{1}, dataValueField:{2}, filter:{3}, suggest:{4}, dataSource:{5}, change: {6}, index:{7} })")]
            public static KendoComboBox Element(Element elm, string dataTextField, string dataValueField, string filter, bool suggest, object dataSource, Action<Event> change, int index)
            {
                return null;
            }

            public string DataTextField;
            public string DataValueField;
            public object DataSource;
            public string Filter;
            public bool Suggest;
        }

        public class ListItem
        {
            public object Text;
            public int Value;
        }
    }
}
