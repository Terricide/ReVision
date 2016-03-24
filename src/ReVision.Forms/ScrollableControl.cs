using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ScrollableControl : Control, IDisposable
    {
        private bool mAutoScroll;
        public bool AutoScroll
        {
            get
            {
                return mAutoScroll;
            }
            set
            {
                if( mAutoScroll != value )
                {
                    mAutoScroll = value;
                    RaisePropertyChanged();
                }
            }
        }

        protected void Invalidate()
        {
            
        }


        public EventHandler Resize { get; set; }
    }
}
