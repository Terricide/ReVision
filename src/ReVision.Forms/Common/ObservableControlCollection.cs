using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ObservableControlCollection<T> : ObservableCollection<T>
    {
        public void AddRange(T[] objects)
        {
            foreach(var obj in objects)
            {
                this.Add(obj);
            }
        }
    }
}
