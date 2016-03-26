using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class SplitContainer : Control, ISupportInitialize
    {
        public override string ControlName
        {
            get
            {
                return "SplitContainer";
            }
        }

        public int SplitterDistance { get; set; }

        private Panel mPanel1;
        public Panel Panel1
        {
            get
            {
                if( mPanel1 == null )
                {
                    mPanel1 = new Panel();
                    mPanel1.Parent = this;
                }
                return mPanel1;
            }
        }

        private Panel mPanel2;
        public Panel Panel2
        {
            get
            {
                if( mPanel2 == null )
                {
                    mPanel2 = new Panel();
                    mPanel2.Parent = this;
                }
                return mPanel2;
            }
        }

        public void BeginInit()
        {
            
        }

        public void EndInit()
        {
            
        }
    }
}
