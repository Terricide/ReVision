using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class MaskedTextBox : TextBox
    {
        public override string ControlName
        {
            get
            {
                return "MaskedTextBox";
            }
        }
        private string mMask;
        public string Mask
        {
            get
            {
                return mMask;
            }
            set
            {
                if( mMask != value )
                {
                    mMask = value;
                    RaisePropertyChanged();
                }
            }
        }
    }
}
