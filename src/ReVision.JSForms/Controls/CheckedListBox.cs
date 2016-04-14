using Bridge;
using Bridge.Html5;
using qx.data.controller;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class CheckedListBox : ListBox
    {
        public CheckedListBox()
        {
            this.Element = new qx.ui.form.List();
        }
        public override void Render()
        {
            base.SetAttributes();

            var list = (qx.ui.form.List)this.Element;

            //var rawData = JSON.Stringify(this.Items);
            //var arrayWrapper = qx.data.marshal.Json.CreateModel(rawData);

            //var listController = new qx.data.controller.List(arrayWrapper, list, "name");

            //foreach (var item in Items)
            //{
            //    list.Add(new qx.ui.form.CheckBox(item.ToString()));
            //}
            var rawData = (from i in Items
                           select new CheckedItem
                           {
                               Name = i.ToString(),
                               Checked = false
                           }).ToArray();

            var data = new qx.data.Array(rawData);
            var controller = new qx.data.controller.List(null, list);

            // create the delegate to change the bindings
            var del = new ControllerDelegate {
                ConfigureItem = (item) =>
                {
                    item.SetPadding(3);
                },
                CreateItem = () =>
                {
                    return new qx.ui.form.CheckBox();
                },
                BindItem = (ctrl, item, id) =>
                {
                    ctrl.BindProperty("", "model", null, item, id);
                    ctrl.BindProperty("name", "label", null, item, id);
                    ctrl.BindProperty("checked", "value", null, item, id);
                    ctrl.BindPropertyReverse("checked", "value", null, item, id);
                }
            };
            controller.Delegate = del;

            controller.Model = data;
        }

        private class CheckedItem
        {
            public bool Checked { get; set; }
            public string Name { get; set; }

            //public void SetChecked(bool c)
            //{
            //    this.Checked = c;
            //}
        }
    }
}
