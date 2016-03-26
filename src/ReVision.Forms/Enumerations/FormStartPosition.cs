using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public enum FormStartPosition
    {
        WindowsDefaultLocation,//	The form is positioned at the Windows default location and has the dimensions specified in the form's size.
        CenterParent,//	The form is centered within the bounds of its parent form.
        CenterScreen,//	The form is centered on the current display, and has the dimensions specified in the form's size.
        Manual,//	The position of the form is determined by the Location property.
        WindowsDefaultBounds,//	The form is positioned at the Windows default location and has the bounds determined by Windows default.
    }
}
