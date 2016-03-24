using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Windows.Forms
{
    public class RadioButton : CheckBox
    {
        public override string ControlName
        {
            get
            {
                return "RadioButton";
            }
        }

        public override bool Checked
        {
            get
            {
                return mChecked;
            }
            set
            {
                if (mChecked != value)
                {
                    mChecked = value;
                    if (value)
                    {
                        foreach (var ctrl in (from c in this.Parent.Controls
                                              where c is RadioButton && c != this
                                              select c))
                        {
                            RadioButton rb = ctrl as RadioButton;
                            rb.Checked = false;
                        }
                    }
                    RaisePropertyChanged();
                    OnCheckedChanged();
                }
            }
        }
    }
}