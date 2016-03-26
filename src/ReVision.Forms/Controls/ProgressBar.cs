using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ProgressBar : Control
    {
        public override string ControlName
        {
            get
            {
                return "ProgressBar";
            }
        }

        private int minimum = 0;
        private int maximum = 100;

        public int Minimum
        {
            get
            {
                return minimum;
            }
            set
            {
                if( minimum != value )
                {
                    minimum = value;
                    RaisePropertyChanged();
                }
            }
        }

        public int Maximum
        {
            get
            {
                return maximum;
            }
            set
            {
                if( maximum != value )
                {
                    if( maximum < 0 )
                    {
                        throw new ArgumentOutOfRangeException("Maximum cannot be set to less then 0");
                    }
                    RaisePropertyChanged();
                }
            }
        }

        private int mValue;
        public int Value
        {
            get
            {
                return mValue;
            }
            set
            {
                if( mValue != value )
                {
                    if ((value < minimum) || (value > maximum))
                    {
                        throw new ArgumentOutOfRangeException(string.Format("You are attempting to set Value out of the range of {0} and {1}", minimum, maximum));
                    }
                    mValue = value;
                    RaisePropertyChanged();
                }
            }
        }
    }
}
