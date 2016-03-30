using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class KeyEventArgs : EventArgs
    {
        public KeyEventArgs()
        {
       
        }

        //
        // Summary:
        //     Gets a value indicating whether the ALT key was pressed.
        //
        // Returns:
        //     true if the ALT key was pressed; otherwise, false.
        public virtual bool Alt { get; set; }
        //
        // Summary:
        //     Gets a value indicating whether the CTRL key was pressed.
        //
        // Returns:
        //     true if the CTRL key was pressed; otherwise, false.
        public bool Control { get; set; }
        //
        // Summary:
        //     Gets or sets a value indicating whether the event was handled.
        //
        // Returns:
        //     true to bypass the control's default handling; otherwise, false to also pass
        //     the event along to the default control handler.
        public bool Handled { get; set; }
        //
        // Summary:
        //     Gets the keyboard code for a System.Windows.Forms.Control.KeyDown or System.Windows.Forms.Control.KeyUp
        //     event.
        //
        // Returns:
        //     A System.Windows.Forms.Keys value that is the key code for the event.
        public Keys KeyCode
        {
            get
            {
                return (Keys)KeyValue;
            }
        }
        //
        // Summary:
        //     Gets the key data for a System.Windows.Forms.Control.KeyDown or System.Windows.Forms.Control.KeyUp
        //     event.
        //
        // Returns:
        //     A System.Windows.Forms.Keys representing the key code for the key that was pressed,
        //     combined with modifier flags that indicate which combination of CTRL, SHIFT,
        //     and ALT keys was pressed at the same time.
        public Keys KeyData
        {
            get
            {
                return (Keys)KeyValue;
            }
        }
        //
        // Summary:
        //     Gets the keyboard value for a System.Windows.Forms.Control.KeyDown or System.Windows.Forms.Control.KeyUp
        //     event.
        //
        // Returns:
        //     The integer representation of the System.Windows.Forms.KeyEventArgs.KeyCode property.
        public int KeyValue { get; set; }
        //
        // Summary:
        //     Gets the modifier flags for a System.Windows.Forms.Control.KeyDown or System.Windows.Forms.Control.KeyUp
        //     event. The flags indicate which combination of CTRL, SHIFT, and ALT keys was
        //     pressed.
        //
        // Returns:
        //     A System.Windows.Forms.Keys value representing one or more modifier flags.
        public Keys Modifiers { get; }
        //
        // Summary:
        //     Gets a value indicating whether the SHIFT key was pressed.
        //
        // Returns:
        //     true if the SHIFT key was pressed; otherwise, false.
        public virtual bool Shift { get; set; }
        //
        // Summary:
        //     Gets or sets a value indicating whether the key event should be passed on to
        //     the underlying control.
        //
        // Returns:
        //     true if the key event should not be sent to the control; otherwise, false.
        public bool SuppressKeyPress { get; set; }
    }
}
