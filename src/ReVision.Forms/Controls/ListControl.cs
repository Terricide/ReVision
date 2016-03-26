using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ListControl : Control
    {

        private ObservableControlCollection<object> mItems;
        public ObservableControlCollection<object> Items
        {
            get
            {
                if( mItems == null )
                {
                    mItems = new ObservableControlCollection<object>();
                    mItems.CollectionChanged += Items_CollectionChanged;
                }
                return mItems;
            }
            set
            {
                mItems = value;
            }
        }

        private void Items_CollectionChanged(object sender, Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ItemsChanged(e).Wait();
        }

        private async Task ItemsChanged(System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems)
                {
                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "addListItem",
                        Value = JsonConvert.SerializeObject(ctrl, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        })
                    });
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems)
                {
                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "removeListItem",
                    });
                }
            }
        }

        public bool FormattingEnabled { get; set; }
    }
}
