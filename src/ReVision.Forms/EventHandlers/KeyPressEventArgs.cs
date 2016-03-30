using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class KeyPressEventArgs : EventArgs
    {
        //
        // Summary:
        //     Initializes a new instance of the System.Windows.Forms.KeyPressEventArgs class.
        //
        // Parameters:
        //   keyChar:
        //     The ASCII character corresponding to the key the user pressed.
        public KeyPressEventArgs(char keyChar)
        {
            this.KeyChar = keyChar;
        }

        public KeyPressEventArgs()
        {

        }

        //
        // Summary:
        //     Gets or sets a value indicating whether the System.Windows.Forms.Control.KeyPress
        //     event was handled.
        //
        // Returns:
        //     true if the event is handled; otherwise, false.
        public bool Handled { get; set; }
        //
        // Summary:
        //     Gets or sets the character corresponding to the key pressed.
        //
        // Returns:
        //     The ASCII character that is composed. For example, if the user presses SHIFT
        //     + K, this property returns an uppercase K.
        public char KeyChar { get; set; }
    }
}
