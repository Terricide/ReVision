using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabControl : Control
    {
        public int SelectedIndex;

        public TabControl()
        {
            this.Element = new Bridge.Html5.UListElement();
        }

        public override void Render()
        {
            base.Render();

            //int i = 0;
            //foreach(var ctrl in this.GetControls())
            //{
            //    var li = new Bridge.Html5.LIElement();
            //    if (i == this.SelectedIndex)
            //    {
            //        li.ClassName = "k-state-active";
            //    }
            //    i++;
            //    ul.AppendChild(li);
            //}
            //this.Element.AppendChild(ul);
            //        for (var i = 0; i < obj.Controls.length; i++)
            //        {
            //            var div = document.createElement('div');
            //            var size = obj.Controls[i].Size.split(',');
            //            div.style.height = size[1] + 'px';
            //            var newElement = createNewElement(obj.Controls[i], div);
            //            controls[obj.ClientId].children.push(newElement);
            //            this.Element.appendChild(div);
            //        }

            //$(this.Element).kendoTabStrip({
            //            show: function(e) {
            //                var selectedIndex = $(e.item).index();
            //                var evt = {
            //            ClientId: this.element[0].id,
            //            EventType: 'selectedIndexChanged',
            //            Value: selectedIndex
            //               };
            //            send(evt);
            //        }
            //    });
        }
    }

    public class KendoTabStrip
    {
        [Template("$({0}).kendoTabStrip()")]
        public static KendoTabStrip Element(Element elm)
        {
            return null;
        }
    }
}
