using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ContainerControl : ScrollableControl
    {
        private Control mActiveControl;
        public Control ActiveControl 
        { 
            get
            {
                return mActiveControl;
            }
            set
            {
                if( mActiveControl != value )
                {
                    mActiveControl = value;
                    RaisePropertyChanged();
                }
            }
        }
    }
}
