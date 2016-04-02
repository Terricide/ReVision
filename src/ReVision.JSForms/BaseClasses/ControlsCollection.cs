using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ControlsCollection : List<Control>
    {
        public Control Parent { get; set; }
        public event EventHandler<Collections.Specialized.NotifyCollectionChangedEventArgs<Control>> CollectionChanged;
        public ControlsCollection(Control parent)
        {
            this.Parent = parent;
            this.CollectionChanged += ControlsCollection_CollectionChanged1;
        }

        private void ControlsCollection_CollectionChanged1(object sender, Collections.Specialized.NotifyCollectionChangedEventArgs<Control> e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems)
                {
                    ctrl.Parent = Parent;
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems)
                {
                    ctrl.Parent = null;
                }
            }
        }

        public Control this[string ctrlName]
        {
            get
            {
                return this.Where(n => n.Name == ctrlName).FirstOrDefault();
            }
        }
    }
}
