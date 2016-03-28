using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace System.Windows.Forms
{
    public class Button : Control
    {
        //public override string ControlName
        //{
        //    get
        //    {
        //        return "Button";
        //    }
        //}

        public bool UseVisualStyleBackColor { get; set; }

        private FlatAppearance mFlatAppearance = null;
        public FlatAppearance FlatAppearance 
        {
            get
            {
                if( mFlatAppearance == null )
                {
                    mFlatAppearance = new FlatAppearance();
                }
                return mFlatAppearance;
            }
            set
            {
                mFlatAppearance = value;
            }
        }

        public virtual ContentAlignment TextAlign { get; set; }
    }
}