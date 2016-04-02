using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace System.Windows.Forms
{
    public partial class Component
    {
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

    // Summary:
    //     Intended to be used for objects that need to be observed
    public interface IObservableItem
    {
        // Summary:
        //     Occurs when [observable item property changed].
        event ObservableItemPropertyChangedHandler ObservableItemPropertyChanged;
    }


    // Summary:
    //     Delegate for the IObservableItem interface
    public delegate void ObservableItemPropertyChangedHandler(object objSender, ObservableItemPropertyChangedArgs objArgs);

    public class ObservableItemPropertyChangedArgs : EventArgs
    {
        private string property;
        private object subject;
        // Summary:
        //     Initializes a new instance of the Gizmox.WebGUI.Common.Interfaces.ObservableItemPropertyChangedArgs
        //     class.
        //
        // Parameters:
        //   strProperty:
        //     The STR property.
        public ObservableItemPropertyChangedArgs(string strProperty)
        {
            this.property = strProperty;
        }
        //
        // Summary:
        //     Initializes a new instance of the Gizmox.WebGUI.Common.Interfaces.ObservableItemPropertyChangedArgs
        //     class.
        //
        // Parameters:
        //   strProperty:
        //     The property.
        //
        //   objSubject:
        //     The subject.
        public ObservableItemPropertyChangedArgs(string strProperty, object objSubject) : this(strProperty)
        {
            this.subject = objSubject;
        }

        // Summary:
        //     Gets the name of the property that has changed
        public string Property
        {
            get
            {
                return property;
            }
        }
        //
        // Summary:
        //     Gets the subject.
        public object Subject
        {
            get
            {
                return subject;
            }
        }
    }

    public enum AutoScaleMode
    {
        // Summary:
        //     Automatic scaling is disabled.
        None = 0,
        //
        // Summary:
        //     Controls scale relative to the dimensions of the font the classes are using,
        //     which is typically the system font.
        Font = 1,
        //
        // Summary:
        //     Controls scale relative to the display resolution. Common resolutions are
        //     96 and 120 DPI.
        Dpi = 2,
        //
        // Summary:
        //     Controls scale according to the classes' parent's scaling mode. If there
        //     is no parent, automatic scaling is disabled.
        Inherit = 3,
    }
}
