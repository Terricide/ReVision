using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class Timer : System.Timers.Timer
    {
        public Timer()
        {
            this.Elapsed += Timer_Elapsed;
        }

        void Timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            this.Tick(this, e);
        }

        public object Tag { get; set; }
        public event EventHandler Tick;
    }
}
