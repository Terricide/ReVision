using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ControlsCollection : ObservableCollection<Control>
    {
        private Control Parent;
        public ControlsCollection(Control parent)
        {
            this.Parent = parent;
            this.CollectionChanged += ControlsCollection_CollectionChanged;
        }

        private void ControlsCollection_CollectionChanged(object sender, Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems.Cast<Control>())
                {
                    ctrl.Parent = Parent;
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems.Cast<Control>())
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
