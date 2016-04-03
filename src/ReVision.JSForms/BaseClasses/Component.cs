using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public partial class Component : IDisposable, IObservableItem
    {
        public string ControlName { get; set; }
        public event EventHandler Disposed;
        public event ObservableItemPropertyChangedHandler ObservableItemPropertyChanged;

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        private string mClientId;
        public string ClientId
        {
            get
            {
                return mClientId;
            }
            set
            {
                if (mClientId != value)
                {
                    mClientId = value;
                    RaisePropertyChanged("ClientId", value);
                }
            }
        }

        public virtual async Task FireEvent(WSEventArgs evt)
        {
            
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual async Task RaisePropertyChanged(string propName, object val)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propName));

            await FireEvent(new WSEventArgs()
            {
                ClientId = this.ClientId,
                EventType = "PropertyChanged",
                Value = new
                {
                    Name = propName,
                    Value = val
                }
            });
        }

        public object Tag { get; set; }
    }
}
