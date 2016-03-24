using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class CheckBox : Control
    {
        public event EventHandler CheckedChanged;
        protected bool mChecked;
        public virtual bool Checked
        {
            get
            {
                return mChecked;
            }
            set
            {
                if( mChecked != value )
                {
                    mChecked = value;
                    RaisePropertyChanged();
                    OnCheckedChanged();
                }
            }
        }

        public void OnCheckedChanged()
        {
            if (CheckedChanged != null)
            {
                CheckedChanged(this, EventArgs.Empty);
            }
        }

        public override Task ProcessMessage(WSEventArgs args)
        {
            var id = GetId(args.ClientId);

            if (this.ClientId == id)
            {
                switch (args.EventType)
                {
                    case "checkChanged":
                        {
                            this.Checked = (bool)args.Value;
                        }
                        break;
                }
            }
            return base.ProcessMessage(args);
        }

        public override string ControlName
        {
            get
            {
                return "CheckBox";
            }
        }

        public bool UseVisualStyleBackColor { get; set; }
    }
}
