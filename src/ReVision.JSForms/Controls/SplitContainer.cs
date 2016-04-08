using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class SplitContainer : Control
    {
        public int SplitterDistance;
        private Panel mPanel1;
        public Panel Panel1
        {
            get
            {
                return mPanel1;
            }
            set
            {
                mPanel1 = JSON.Parse<Panel>(JSON.Stringify(value));
                mPanel1.Parent = this;
            }
        }
        private Panel mPanel2;
        public Panel Panel2
        {
            get
            {
                return mPanel2;
            }
            set
            {
                mPanel2 = JSON.Parse<Panel>(JSON.Stringify(value));
                mPanel2.Parent = this;
            }
        }

        public override void Render()
        {
            this.Panel1.Render();
            this.Panel2.Render();

            base.Render();

            KendoSplitter.Element(this.Element, this.SplitterDistance);
        }
    }

    public class KendoSplitter
    {
        [Template("$({0}).kendoSplitter({panes: [{ size: {1} },]})")]
        public static KendoSplitter Element(Element elm, int splitterDistance)
        {
            return null;
        }
    }
}
