using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class DateTimePicker : Control
    {
        public override string ControlName
        {
            get
            {
                return "DateTimePicker";
            }
        }

        public override Task ProcessMessage(WSEventArgs args)
        {
            var id = GetId(args.ClientId);

            if (this.ClientId == id)
            {
                switch (args.EventType)
                {
                    case "valueChanged":
                        {
                            this.Value = (DateTime)args.Value;
                        }
                        break;
                }
            }
            return base.ProcessMessage(args);
        }

        public event EventHandler ValueChanged;

        private DateTime mValue;
        public DateTime Value
        {
            get
            {
                return mValue;
            }
            set
            {
                if( this.mValue != value )
                {
                    mValue = value;
                    RaisePropertyChanged();

                    if (ValueChanged != null)
                    {
                        ValueChanged(this, EventArgs.Empty);
                    }
                }
            }
        }
    }
}
