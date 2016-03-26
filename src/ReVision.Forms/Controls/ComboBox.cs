using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace System.Windows.Forms
{
    public class ComboBox : Control
    {
        public ComboBox()
        {
            this.Items.CollectionChanged += Items_CollectionChanged;
        }

        public event EventHandler SelectedIndexChanged;

        void Items_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ItemsChanged(e).Wait();
        }

        private async Task ItemsChanged(System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                int start = e.NewStartingIndex;
                foreach (var ctrl in e.NewItems.Cast<object>())
                {
                    var item = new
                    {
                        Value = ctrl.ToString(),
                        Index = start++
                    };

                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "addComboBoxItem",
                        Value = JsonConvert.SerializeObject(item)
                    });
                }
            }
            else if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                int start = e.OldStartingIndex;
                foreach (var ctrl in e.OldItems.Cast<object>())
                {
                    var item = new
                    {
                        Value = ctrl.ToString(),
                        Index = start++
                    };

                    await FireEvent(new WSEventArgs()
                    {
                        ClientId = this.ClientId,
                        EventType = "removeComboBoxItem",
                        Value = JsonConvert.SerializeObject(item, Formatting.None, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        })
                    });
                }
            }
        }
        public ObjectCollecton Items = new ObjectCollecton();

        public override string ControlName
        {
            get
            {
                return "ComboBox";
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

        private bool mFormattingEnabled;
        public bool FormattingEnabled
        {
            get
            {
                return mFormattingEnabled; 
            }
            set
            {
                if( mFormattingEnabled != value )
                {
                    mFormattingEnabled = value;
                    RaisePropertyChanged();
                }
            }
        }

        public object SelectedItem
        {
            get
            {
                if( this.SelectedIndex == -1 )
                {
                    return null;
                }

                return this.Items[this.SelectedIndex];
            }
            set
            {
                if( value == null )
                {
                    this.SelectedIndex = -1;
                    return;
                }

                for(int i=0; i < Items.Count; i++)
                {
                    if( Items[i] == value )
                    {
                        this.SelectedIndex = i;
                        break;
                    }
                }
            }
        }

        private int selectedIndex = -1;
        public int SelectedIndex
        {
            get
            {
                return this.selectedIndex;
            }
            set
            {
                if( this.selectedIndex != value )
                {
                    this.selectedIndex = value;
                    RaisePropertyChanged();
                    if( SelectedIndexChanged != null )
                    {
                        this.SelectedIndexChanged(this, EventArgs.Empty);
                    }
                }
            }
        }

    }

    public class ObjectCollecton : ObservableCollection<object>
    {
        public void AddRange(IEnumerable<object> objects)
        {
            foreach(var o in objects)
            {
                this.Add(o);
            }
        }
    }
}