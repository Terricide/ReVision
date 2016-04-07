using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace System.Windows.Forms
{
    public class ListView : Control
    {
        public ListView()
        {
            this.Columns.CollectionChanged += Columns_CollectionChanged;
        }

        void Columns_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ColumnsChanged(e).Wait();
        }

        private async Task ColumnsChanged(System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems.Cast<ColumnHeader>())
                {
                    ctrl.Parent = this;

                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = ctrl.ClientId,
                        EventType = "addListViewColumn",
                        Value = JsonConvert.SerializeObject(ctrl, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        })
                    });
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems.Cast<ColumnHeader>())
                {
                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = ctrl.ClientId,
                        EventType = "removeListViewColumn",
                    });
                }
            }
        }
        public ObservableControlCollection<ColumnHeader> Columns = new ObservableControlCollection<ColumnHeader>();

        private ListViewItemCollection mItems = null;
        public ListViewItemCollection Items
        {
            get
            {
                if( mItems == null )
                {
                    mItems = new ListViewItemCollection();
                    mItems.CollectionChanged += mItems_CollectionChanged;
                }

                return mItems;
            }
        }

        void mItems_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ItemsChanged(e).Wait();
        }

        private async Task ItemsChanged(System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var ctrl in e.NewItems.Cast<ListViewItem>())
                {
                    ctrl.Parent = this;

                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "addListViewItem",
                        Value = JsonConvert.SerializeObject(ctrl, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        })
                    });
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                foreach (var ctrl in e.OldItems.Cast<ListViewItem>())
                {
                    ctrl.Parent = this;

                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "removeListViewItem",
                        Value = JsonConvert.SerializeObject(ctrl, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        })
                    });
                }
            }
            else if (e.Action == Collections.Specialized.NotifyCollectionChangedAction.Reset)
            {
                await FireEvent(new WSEventArgs()
                {
                    ClientId = this.ClientId,
                    EventType = "clearList"
                });
            }
        }

        public override string ControlName
        {
            get
            {
                return "ListView";
            }
        }

        public class ListViewItemCollection : ObservableCollection<ListViewItem>
        {
            public ListViewItem Add(string text = null)
            {
                var item = new ListViewItem(text);
                this.Add(item);
                return item;
            }

            public void AddRange(IEnumerable<ListViewItem> items)
            {
                foreach(var item in items)
                {
                    this.Add(item);
                }
            }

            public ListViewItem Add()
            {
                var item = new ListViewItem();
                this.Add(item);
                return item;
            }
        }

        public View View { get; set; }

        public bool UseCompatibleStateImageBehavior { get; set; }
    }

    
}