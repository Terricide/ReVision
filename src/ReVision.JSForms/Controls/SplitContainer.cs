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
        public SplitContainer()
        {
            
        }
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
            var pane = new qx.ui.splitpane.Pane(qx.ui.splitpane.SplitPaneType.Horizontal);
            this.Element = pane;

            foreach(var ctrl in this.Panel1.GetControls())
            {
                ctrl.Render();
            }
            foreach (var ctrl in this.Panel2.GetControls())
            {
                ctrl.Render();
            }

            base.Render();

            pane.Add(this.Panel1.Element, 0);
            pane.Add(this.Panel2.Element, 1);
        }
    }
}
