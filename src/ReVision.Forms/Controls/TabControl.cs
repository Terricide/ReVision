using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class TabControl : ScrollableControl
    {
        public override string ControlName
        {
            get
            {
                return "TabControl";
            }
        }

        private int mSelectedIndex;
        public int SelectedIndex
        {
            get
            {
                return mSelectedIndex;
            }
            set
            {
                if( mSelectedIndex != value )
                {
                    mSelectedIndex = value;
                    RaisePropertyChanged();
                }
            }
        }

        public override async Task ProcessMessage(WSEventArgs args)
        {
            var id = GetId(args.ClientId);

            if (this.ClientId == id)
            {
                switch (args.EventType)
                {
                    case "selectedIndexChanged":
                        this.SelectedIndex = Convert.ToInt32(args.Value);
                        break;
                }
            }
            await base.ProcessMessage(args);
        }
    }
}
