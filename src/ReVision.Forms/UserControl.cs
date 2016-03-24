using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class UserControl : ContainerControl
    {
        public event EventHandler Load;

        public override string ControlName
        {
            get
            {
                return "UserControl";
            }
        }

        public override async Task ProcessMessage(WSEventArgs args)
        {
            var clientId = GetId(args.ClientId);

            if (clientId == this.ClientId)
            {
                switch (args.EventType)
                {
                    case "Load":
                        {
                            if (this.Load != null)
                            {
                                this.Load(this, EventArgs.Empty);
                            }
                        }
                        break;
                }
            }
            await base.ProcessMessage(args);
        }
    }
}
