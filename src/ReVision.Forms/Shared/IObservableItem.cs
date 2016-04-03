using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
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
}
